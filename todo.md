# Breach Check Feature Checklist

- [x] Confirm the k-anonymity API contract and privacy behavior.
- [x] Hash the entered password locally with Web Crypto SHA-1 and send only the first five hash characters.
- [x] Compare returned suffixes locally and show breach count without exposing the password.
- [x] Add loading, found, not-found, empty, and network-error states to the analyzer UI.
- [x] Add concise privacy and remediation guidance for breached passwords.
- [x] Validate TypeScript, production build, and responsive presentation.
- [x] Save an updated delivery checkpoint.

## GitHub Publishing

- [ ] Confirm the working tree and current branch.
- [ ] Create a private GitHub repository named `password-strength-analyzer`.
- [ ] Commit and push the latest project state.
- [ ] Verify the remote URL and pushed branch.
