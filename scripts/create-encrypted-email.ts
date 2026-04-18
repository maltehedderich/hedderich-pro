import { createEncryptedEmail } from '../src/lib/email-obfuscation';

const [email, explicitKey] = Bun.argv.slice(2);
const obfuscationKey = explicitKey ?? process.env.PUBLIC_EMAIL_OBFUSCATION_KEY;

if (!email) {
	console.error('Usage: bun run obfuscate:email -- you@example.com [base64AesKey]');
	process.exit(1);
}

if (!obfuscationKey) {
	console.error(
		'Missing PUBLIC_EMAIL_OBFUSCATION_KEY. Pass a base64 AES key as the second argument or via the environment.'
	);
	process.exit(1);
}

try {
	const encrypted = await createEncryptedEmail(email, obfuscationKey);
	console.log(JSON.stringify(encrypted, null, 2));
} catch (error) {
	const message = error instanceof Error ? error.message : 'Unknown error';
	console.error(`Failed to encrypt email: ${message}`);
	process.exit(1);
}
