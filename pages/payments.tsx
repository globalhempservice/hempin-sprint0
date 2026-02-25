import LegalLayout from '@/components/legal/LegalLayout';

export default function PaymentsPage() {
  return (
    <LegalLayout title="Payments & Refunds" lastUpdated="2025-10-01">
      <h3 className="planet-title">Processor</h3>
      <p>
        Payments are processed by PayPal. We don’t store full card/bank details on our servers.
      </p>

      <h3 className="planet-title">When we capture funds</h3>
      <p>
        For campaign pledges, funds are captured at approval unless otherwise stated on the campaign page.
      </p>

      <h3 className="planet-title">Refunds</h3>
      <p>
        Early campaign pledges fund development and operations. If there’s an issue, email us at
        <a href="mailto:info@globalhempservice.com"> info@globalhempservice.com</a> and we’ll review case by case.
      </p>

      <h3 className="planet-title">Receipts & records</h3>
      <p>
        You’ll receive PayPal confirmations. We can also provide pledge references visible in your account.
      </p>

      <h3 className="planet-title">Perks</h3>
      <p>
        Perks are gratitude items or access windows; they are not equity, tokens, or financial returns.
      </p>
    </LegalLayout>
  );
}