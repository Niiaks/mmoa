# mmoa

A community-driven fundraising platform built for Ghana. Organizers create campaigns for bereavements, medical emergencies, education, and other urgent needs — contributors pay via Paystack, and organizers withdraw directly to Mobile Money.

## How It Works

1. **Organizer** registers, creates a campaign with a title, description, type, target amount, and optional deadline (defaults to 30 days).
2. A **shareable link** is generated (`/contribute/:slug`) — anyone with the link can contribute.
3. **Contributors** pay via Paystack. The webhook confirms payment and updates `totalRaised`.
4. **Organizer** withdraws funds to their MoMo number. The platform takes a 2.5% fee + GHS 1 Paystack transfer fee.

## License

MIT
