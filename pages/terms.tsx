import LegalLayout from '@/components/legal/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="2025-10-01">
      <h3 className="planet-title">Agreement</h3>
      <p>
        By using Hemp’in sites and services, you agree to these Terms and our Privacy Policy.
        If you don’t agree, please don’t use the services.
      </p>

      <h3 className="planet-title">Accounts</h3>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>Provide accurate information and keep your credentials secure.</li>
        <li>You’re responsible for activity under your account.</li>
      </ul>

      <h3 className="planet-title">Use of services</h3>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>No unlawful, fraudulent, or abusive activity.</li>
        <li>No attempts to disrupt, reverse engineer, or misuse the platform.</li>
      </ul>

      <h3 className="planet-title">Funding & perks</h3>
      <p>
        Pledges fund development and community operations. Perks are gratitude items or access benefits;
        they are not financial instruments or guarantees. Payment terms are in <a href="/payments">Payments & Refunds</a>.
      </p>

      <h3 className="planet-title">IP & content</h3>
      <p>
        We and our licensors own the platform and brand assets. You retain rights to your content but grant us a license
        to host and display it as needed to provide the services.
      </p>

      <h3 className="planet-title">Disclaimers</h3>
      <p>
        Services are provided “as is”. To the maximum extent permitted by law, we disclaim warranties and limit liability.
      </p>

      <h3 className="planet-title">Termination</h3>
      <p>
        We may suspend or terminate access for violations or risks to users, security, or compliance.
      </p>

      <h3 className="planet-title">Governing law</h3>
      <p>
        These Terms are governed by the laws of Delaware, USA, unless local mandatory law applies.
      </p>

      <h3 className="planet-title">Contact</h3>
      <p>
        Global Hemp Service LLC — <a href="mailto:info@globalhempservice.com">info@globalhempservice.com</a>
      </p>
    </LegalLayout>
  );
}