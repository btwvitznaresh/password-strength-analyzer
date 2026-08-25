# Breach API Implementation Notes

The official Have I Been Pwned Pwned Passwords documentation describes a public range endpoint using the first five characters of a locally computed SHA-1 password hash. The browser can request `/range/{first-5-hash-characters}` and receive candidate hash suffixes plus occurrence counts, then compare the complete hash locally. The full password and complete hash are not sent to the service.

The official Pwned Passwords page also states that this k-anonymity flow is intended to check whether a password has appeared in known breached datasets and recommends checking passwords against previously breached data. The UI should describe the result as an exposure signal, not as proof that an account is currently compromised.

Implementation assumptions:

| Item | Decision |
|---|---|
| Provider | Have I Been Pwned Pwned Passwords range API |
| Endpoint | `https://api.pwnedpasswords.com/range/{first-five-uppercase-SHA1-characters}` |
| Request data | Only the first five SHA-1 characters |
| Client comparison | Compare returned suffixes to the remaining 35 SHA-1 characters locally |
| Result count | Parse the integer after the colon on the matching suffix line |
| Empty result | Treat HTTP 200 with no matching suffix as not found |
| Failure handling | Show an explicit unavailable state and let local strength analysis continue |
| Rate behavior | Debounce and require an explicit check action to avoid requests on every keystroke |

References:

1. [Have I Been Pwned API Documentation](https://haveibeenpwned.com/API/V3)
2. [Have I Been Pwned Pwned Passwords](https://haveibeenpwned.com/Passwords)
