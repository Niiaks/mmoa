import { ArrowUpRightIcon, FolderX } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { CreateCampaignDialog } from "./create-campaign-dialog"

export function EmptyDemo() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FolderX />
                </EmptyMedia>
                <EmptyTitle>No Campaigns Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t created any campaigns yet. Get started by creating
                    your first campaign.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
                <CreateCampaignDialog />
            </EmptyContent>
            <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
            >
                <Link to="/how-it-works" className="flex items-center gap-2">
                    Learn More <ArrowUpRightIcon />
                </Link>
            </Button>
        </Empty>
    )
}
