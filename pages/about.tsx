import LegalLayout from '@/components/legal/LegalLayout';

export default function AboutPage() {
  return (
    <LegalLayout title="About Hemp’in" lastUpdated="2025-10-01">
      <p>
        <b>Hemp’in</b> is a project by <b>Paul IGLESIA</b>, founder and owner of <b>Global Hemp Service LLC</b>,
        a company registered in Delaware (USA).
      </p>
      <p>
        Launched in 2025, Hemp’in aims to become the navigator of the hemp universe — connecting farms, brands,
        researchers, and communities through practical tools. The first public release is
        <b> fund.hempin.org</b>, a crowdfunding tool for hemp initiatives worldwide.
      </p>
      <p className="muted">
        Contact: <a href="mailto:info@globalhempservice.com">info@globalhempservice.com</a>
      </p>

      <h3 className="planet-title">What we’re building</h3>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>Funding tools for real projects</li>
        <li>Market and directory to find materials and partners</li>
        <li>Knowledge modules grounded in science and practice</li>
        <li>Maps, events, and APIs to operate in the open</li>
      </ul>
    </LegalLayout>
  );
}