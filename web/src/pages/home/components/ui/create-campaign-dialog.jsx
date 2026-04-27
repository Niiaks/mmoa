import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useCreateCampaign } from "@/hooks/campaign/useCreateCampaign";
import { validate } from "@/validation/validate";
import { schemas } from "@/validation/schema";

const campaignTypes = [
  { value: "bereavement", label: "Bereavement" },
  { value: "medical", label: "Medical" },
  { value: "education", label: "Education" },
  { value: "emergency", label: "Emergency" },
  { value: "other", label: "Other" },
];

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    targetAmount: "",
    deadline: "",
    requireContributorName: true,
  });

  const { mutate: createCampaign, isPending } = useCreateCampaign();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      targetAmount: Number(form.targetAmount),
    };

    const { valid, errors: fieldErrors } = validate(
      schemas.createCampaignSchema,
      {
        title: form.title,
        description: form.description,
        targetAmount: Number(form.targetAmount),
        deadline: form.deadline
          ? new Date(form.deadline).toISOString()
          : undefined,
      },
    );

    if (!valid) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    createCampaign(payload, {
      onSuccess: () => {
        setForm({
          title: "",
          description: "",
          type: "",
          targetAmount: "",
          deadline: "",
          requireContributorName: true,
        });
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add new campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create a Campaign</DialogTitle>
          <DialogDescription>
            Fill in the details below to start a new campaign.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-2">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Mensah family funeral"
              value={form.title}
              onChange={handleChange}
              required
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Briefly describe the purpose of this campaign..."
              value={form.description}
              onChange={handleChange}
              required
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Type + Target Amount side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="" disabled>
                  Select type
                </option>
                {campaignTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetAmount">Target (GH₵)</Label>
              <Input
                id="targetAmount"
                name="targetAmount"
                type="number"
                min="1"
                placeholder="10000"
                value={form.targetAmount}
                onChange={handleChange}
                required
              />
              {errors.targetAmount && (
                <p className="text-xs text-red-500">{errors.targetAmount}</p>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div className="grid gap-2">
            <Label htmlFor="deadline">
              Deadline{" "}
              <span className="text-slate-400 text-xs">
                (optional, defaults to 30 days)
              </span>
            </Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
            />
          </div>

          {/* Require contributor name */}
          <div className="flex items-center gap-3">
            <input
              id="requireContributorName"
              name="requireContributorName"
              type="checkbox"
              checked={form.requireContributorName}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-[#bb4d00] accent-[#bb4d00]"
            />
            <Label
              htmlFor="requireContributorName"
              className="text-sm font-normal"
            >
              Require contributors to provide their name
            </Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Campaign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
