import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MyRevLink",
  description: "Read our privacy policy to understand how we collect, use, and safeguard your data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="container flex-col animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/">
        <Button variant="secondary" style={{ marginBottom: '2rem' }}>&larr; Back to Home</Button>
      </Link>
      
      <div className="glass-card" style={{ padding: '2.5rem', color: 'var(--foreground)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>Privacy Policy</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Effective Date: July 2, 2026</p>
        
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          This privacy policy applies to the MyRevLink app for web browsers, together with any related services operated by Raj Jani (collectively, the "Application"). Raj Jani is hereby referred to as the "Service Provider".
        </p>
        
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Information Collection and Use</h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
          The Application collects information when you download and use it. This information may include:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.6, listStyleType: 'disc' }}>
          <li>Your device's Internet Protocol (IP) address</li>
          <li>The pages of the Application that you visit, the time and date of your visit, and the time spent on those pages</li>
          <li>The total time spent on the Application</li>
          <li>The operating system you use</li>
        </ul>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          For a better experience while using the Application, the Service Provider may require you to provide certain personally identifiable information, including but not limited to your Email. The information the Service Provider requests will be retained and used as described in this privacy policy.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Cookies and Tracking Technologies</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          The Application or its third-party SDKs may use cookies, SDKs, pixels, and similar technologies to support functionality, analytics, or service delivery. Where required by applicable law, the Service Provider will obtain consent before using non-essential tracking technologies.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Your Rights</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          You may request access to, correction of, or deletion of your personal data held by the Service Provider. To exercise these rights, or to withdraw consent where processing is based on consent, please contact the Service Provider at <a href="mailto:codealphainfotech@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>codealphainfotech@gmail.com</a>.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Your California Privacy Rights (CCPA/CPRA)</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          If you are a California resident, you have the right to know what personal information is collected, the right to delete personal information, the right to opt out of the sale or sharing of personal information, and the right to non-discrimination for exercising these rights. To exercise your CCPA/CPRA rights, contact the Service Provider at <a href="mailto:codealphainfotech@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>codealphainfotech@gmail.com</a>.
        </p>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          The Service Provider may use the information you provide to send important information, required notices, and, where permitted by law, marketing communications.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Third Party Access</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.
        </p>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.6, listStyleType: 'disc' }}>
          <li><a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>Clerk</a></li>
        </ul>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Disclosure of Information</h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
          The Service Provider may disclose User Provided and Automatically Collected Information:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.6, listStyleType: 'disc' }}>
          <li>As required by law, such as to comply with a subpoena, or similar legal process;</li>
          <li>When they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;</li>
          <li>With their trusted services providers who work on their behalf, do not have an independent use of the information the Service Provider discloses to them, and have agreed to adhere to the rules set forth in this privacy statement.</li>
        </ul>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>International Data Transfers</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          The Service Provider or its third-party service providers may transfer personal data to countries outside your country of residence, including outside the European Economic Area (EEA). Where applicable law requires safeguards for international transfers, the Service Provider will use appropriate mechanisms:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.6, listStyleType: 'disc' }}>
          <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
          <li>Adequacy decisions or other legally recognized transfer mechanisms</li>
          <li>Your consent, where required and legally permitted</li>
        </ul>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Data protection laws in other countries may differ from those in your jurisdiction. Where required by law, the Service Provider will apply appropriate safeguards and obtain any consent required for the transfer.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Opt-Out Rights</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          You can stop further collection of information from your device by ceasing to use the website. Ceasing to use will stop the website from collecting data from your device, but it does not automatically delete information that has already been transmitted to the Service Provider or to third parties.
        </p>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          To request deletion of your personal data, to withdraw consent, or to exercise any of your rights, contact the Service Provider at <a href="mailto:codealphainfotech@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>codealphainfotech@gmail.com</a>.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Data Retention Policy</h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
          The Service Provider retains personal data based on its necessity for the stated purposes:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.6, listStyleType: 'disc' }}>
          <li><strong>User Provided Data:</strong> Retained for the duration of your use of the Application plus 12 months thereafter, unless longer retention is required by law.</li>
          <li><strong>Automatically Collected Data:</strong> Retained for up to 24 months from collection, unless longer retention is required for legal compliance.</li>
          <li><strong>Aggregated and Anonymized Data:</strong> Retained indefinitely as it no longer identifies you.</li>
          <li><strong>Data required for legal compliance:</strong> Retained as long as required by applicable law.</li>
        </ul>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          You may request deletion of your personal data, subject to any legal obligation to retain it. If you want the Service Provider to delete User Provided Data submitted through the Application, please contact them at <a href="mailto:codealphainfotech@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>codealphainfotech@gmail.com</a>. Please note that some User Provided Data may be required for the Application to function properly.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Children</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          The Application is not intended for children under 16 years of age, or such higher age as required by applicable law. The Service Provider does not knowingly solicit data from children or market the Application to them.
        </p>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Where parental or guardian consent is required under applicable law, the Application is not intended for use without that consent. The Service Provider does not knowingly collect personally identifiable information from children under 16 years of age in violation of applicable law. In the event the Service Provider discovers that a child has provided personal information, the Service Provider will immediately delete this from their servers. If you are a parent or guardian and you are aware that your child has provided the Service Provider with personal information, please contact the Service Provider at <a href="mailto:codealphainfotech@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>codealphainfotech@gmail.com</a> so that they will be able to take the necessary actions.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Security</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Data Breach Notification</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          If a data breach occurs that affects your personal data, the Service Provider will notify you in accordance with applicable legal requirements, including, where required, providing information about the nature of the breach and the steps being taken to address it.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Changes</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          The Service Provider may update this Privacy Policy from time to time. The Service Provider will notify you of material changes by posting the updated Privacy Policy with an effective date. Where required by law, the Service Provider will seek your consent to material changes before they take effect.
        </p>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Previous versions of this Privacy Policy will be maintained and made available upon request by contacting the Service Provider at <a href="mailto:codealphainfotech@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>codealphainfotech@gmail.com</a>.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Your Consent</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Where processing is based on consent, you provide that consent by affirmatively opting in to the relevant feature or action. You may withdraw consent at any time without affecting processing carried out before withdrawal. Processing based on other lawful bases is carried out as described above.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Contact Us</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
          If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at <a href="mailto:codealphainfotech@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>codealphainfotech@gmail.com</a>.
        </p>
      </div>
    </main>
  );
}
