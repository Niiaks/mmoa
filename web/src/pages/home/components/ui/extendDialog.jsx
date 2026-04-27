import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExtendCampaign } from "@/hooks/campaign/useExtendCampaign";
import { useState } from "react";
import { validate } from "@/validation/validate";
import { schemas } from "@/validation/schema";

export function ExtendDialog({ campaign }) {
  const [open, setOpen] = useState(false);
  const [deadline, setDeadline] = useState(
    typeof campaign?.deadline === "string"
      ? campaign.deadline.slice(0, 10)
      : "",
  );
  const [errors, setErrors] = useState({});

  const { mutate: extendCampaign, isPending } = useExtendCampaign(campaign._id);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { valid, errors: fieldErrors } = validate(
      schemas.extendCampaignSchema,
      { deadline: deadline ? new Date(deadline).toISOString() : "" },
    );

    if (!valid) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    extendCampaign(deadline, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const isTooEarly = () => {
    if (!deadline) return true;
    const current =
      typeof campaign?.deadline === "string"
        ? campaign.deadline.slice(0, 10)
        : "";
    if (!current) return true;
    return deadline <= current;
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-10 font-semibold">
          Extend Deadline
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Extend Deadline</DialogTitle>
            <DialogDescription>
              Extend the deadline for this campaign. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
              {errors.deadline && (
                <p className="text-xs text-red-500">{errors.deadline}</p>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="pt-3">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending || !deadline || isTooEarly()}
            >
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
