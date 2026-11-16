# Sovereign AI-Security

**Live: https://sjgant80-hub.github.io/sovereign-ai-security/**

Defensive tools that secure the agentic attack surface — the messages agents read, the tools they call, the code they
write and the output your systems trust — on your own machines, with no AI model asked to judge, and with every claim
re-runnable. From [AI Native Solutions](https://www.ai-nativesolutions.com/). Built by Kar.

The page is a map: each threat is **built** (covered today by a live tool, re-tested by CI on every change),
**partly built**, or **not yet** (named, claimed for nothing). Every built row links to the live tool so you can try to
break it, and a "Check it yourself, without us" section says how to verify each claim with no help from us.

## How it is kept honest

- `kernel.mjs` holds the map and the coverage logic. It is mutation-gated (witness v0.6, every mutant must die) and
  inlined byte for byte into `index.html` (`tools/inline.mjs`; `page-parity.test.mjs` holds the two equal).
- `page-parity.test.mjs` also checks that every estate tool the page links is one the kernel claims, that the credits
  and supplier are on the page in full, that the page holds no prices and no private notation, and that the pages the
  page calls "locked" are exactly the ones CI checks.
- `tools/receipts.mjs` fails CI unless every claimed tool answers live, no tool page loads a script from another site,
  and every page in `tools/guarded.mjs` still carries a browser security policy that forbids calls to any other server
  (the front door may name only the hosts it downloads its optional in-browser model from). The lock check
  (`connectOk`) is mutation-gated too.

```bash
node --test kernel.test.mjs guarded.test.mjs page-parity.test.mjs
node tools/inline.mjs --check
node tools/receipts.mjs
```

## The rules

Defensive first. Scope and authorization on every testing tool. Responsible disclosure. No tools for defeating AI
safety: nothing we supply, to anyone, is built to get around an AI system's safety measures. Sovereign by architecture.
Proven, not trusted.

## Licence and credits

MIT, © Simon Gant. Credits in [NOTICE](NOTICE): the Konomi architecture (Thomas Frumkin); Gary W. Floyd, Lumiea Systems
Research Division — ThunderStruck Service LLC, for the behavioural entropy work.
