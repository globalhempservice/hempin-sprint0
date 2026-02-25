import LegalLayout from '@/components/legal/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="2025-10-01">
      <p>
        We respect your privacy. This policy explains what we collect, why, and how you can exercise your rights.
      </p>

      <h3 className="planet-title">Who we are</h3>
      <p>
        Hemp’in is a project by Global Hemp Service LLC (Delaware, USA).
        Contact: <a href="mailto:info@globalhempservice.com">info@globalhempservice.com</a>.
      </p>

      <h3 className="planet-title">What we collect</h3>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>Account data (email, auth metadata)</li>
        <li>Funding data (pledge amounts, tiers, status)</li>
        <li>Technical data (logs, device, cookies/analytics)</li>
      </ul>

      <h3 className="planet-title">Why we collect it</h3>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>Provide and improve our services</li>
        <li>Payment processing and receipts</li>
        <li>Security, fraud prevention, and legal compliance</li>
      </ul>

      <h3 className="planet-title">Payment processing</h3>
      <p>
        Payments are processed by PayPal. We don’t store your full card or banking details on our servers.
        We receive payment confirmations and metadata needed to deliver perks. See <a href="/payments">Payments & Refunds</a>.
      </p>

      <h3 className="planet-title">Data sharing</h3>
      <p>
        We don’t sell your data. We may share limited data with service providers (e.g., hosting, analytics, payment)
        under contracts that require confidentiality and lawful processing.
      </p>

      <h3 className="planet-title">Your rights</h3>
      <p>
        Depending on your region, you may have rights to access, correct, delete, or download your data.
        Contact us at <a href="mailto:info@globalhempservice.com">info@globalhempservice.com</a>.
      </p>

      <h3 className="planet-title">Data retention</h3>
      <p>
        We retain data while your account is active and as required by law (e.g., tax/financial records).
      </p>

      <h3 className="planet-title">Security</h3>
      <p>
        We use industry-standard controls and trusted infrastructure. No internet service is 100% secure,
        but we work to protect your data and promptly address issues.
      </p>

      <h3 className="planet-title">Changes</h3>
      <p>
        We may update this policy. We’ll post the new date at the top and, when appropriate, notify you.
      </p>
    </LegalLayout>
  );
}