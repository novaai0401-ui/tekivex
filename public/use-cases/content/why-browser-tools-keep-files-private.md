When you use a free online tool to merge a PDF, compress a scan, or turn a spreadsheet into a chart, it's worth pausing to ask a simple question: where does my file actually go? For a lot of "online" tools, the answer is that your file gets uploaded to a company's server, processed there, and sent back. Tekivex's tools work differently — they run entirely inside your own web browser. This guide explains what that means, why it's more private, and how you can check the claim for yourself.

![The Tekivex tools hub, a grid of cards for the free in-browser tools](/images/tools/hub-grid.png)

## What "runs in your browser" actually means

Most people assume anything on the web involves sending data somewhere. And for many tools, that's true: you pick a file, it's uploaded across the internet to a remote server, the server does the work, and you download the result. Your document sat, however briefly, on someone else's computer.

A **client-side** or **in-browser** tool flips that around. The program that does the work is small enough to run on the web page itself, using your device's own processing power. When you drop a PDF into an in-browser merger, the file is opened and combined by code running on your machine. It's the difference between mailing your documents to an office to be photocopied versus using the copier on your own desk.

## Why in-browser is more private

- **The file never crosses the network.** If it isn't uploaded, it can't be intercepted in transit or end up in a log somewhere. It stays on your device from start to finish.
- **Nothing is stored, scanned, or retained.** There's no server-side copy to keep, no automated scan of your contents, and nothing left behind after you close the tab.
- **It keeps working offline.** Because the work happens locally, an in-browser tool can keep functioning even with no internet connection, once the page has loaded.

This matters most for exactly the documents you'd least like to hand over: ID cards, contracts, medical forms, financial spreadsheets, and receipts. With a client-side tool, using it doesn't mean trusting a stranger with those files — because they never receive them.

## How to sanity-check a tool's privacy claim

You don't have to take anyone's word for it. Here's a simple test:

1. Open the tool in your browser and let the page fully load.
2. Disconnect from the internet — turn off Wi-Fi or unplug the network.
3. Now use the tool. Merge, split, compress, or chart your file.

If it still works with no connection, the file clearly isn't being uploaded anywhere — there's nowhere for it to go. That offline test is one of the clearest signs that a tool is genuinely doing its work on your device. (Technically inclined users can go further and watch their browser's network activity while using the tool, but the offline check is enough for most people.)

## The technology that makes this possible

Client-side tools aren't magic — they're the result of the browser quietly becoming a capable computing platform over the last decade. Three pieces do the heavy lifting:

- **The File API** lets a web page read a file you hand it — and only that file — directly into the page's memory. Dropping a file onto a page is not an upload; it's a local read, the same as any desktop program opening a document. Nothing travels anywhere unless the page's code explicitly sends it.
- **Modern JavaScript engines and WebAssembly (WASM)** make in-page processing genuinely fast. WASM lets browsers run near-native code, which is how a web page can decode a PDF, re-encode images, or parse a hundred-thousand-row CSV in seconds on your own hardware.
- **Web Workers** move that heavy work onto background threads, so the page stays responsive while your device crunches the file.

The result is that a whole category of tasks — merging documents, converting images, drawing charts — no longer has any *technical* reason to touch a server. When a tool still uploads your file for one of these jobs, that's a business choice (analytics, data collection, upselling), not an engineering necessity.

## Being honest about the limits

A fair privacy claim should also say what it *doesn't* cover, so here's the fine print done plainly:

- **"Client-side" describes the file handling, not everything about a website.** The page itself still loads over the network, and a site can include analytics or ads that observe *that you visited* — just not the contents of your files. Read a tool's privacy policy to see what's actually collected; ours spells it out in plain language.
- **You're trusting the code the page delivers today.** The offline test below verifies today's behavior — which is exactly why it's worth actually running rather than taking as a slogan.
- **Some jobs genuinely need a server.** Tasks that require enormous compute (video transcoding, large-scale OCR), shared state (real-time collaboration), or data you don't have locally can't be fully client-side. The honest rule: a tool should run in your browser when it can, and be upfront when it can't.

## Tekivex's tools all work this way

Every free tool in the Tekivex [tools hub](/tools) is built to run client-side. Your files are processed in your browser and are never uploaded. That includes [Merge PDF](/tools/merge-pdf), [Split PDF](/tools/split-pdf), [JPG to PDF](/tools/jpg-to-pdf), [Compress PDF](/tools/compress-pdf), and [CSV to Chart](/tools/csv-to-chart). Even the CSV chart tool's "share a link" feature keeps your data in the part of the URL after the `#`, which browsers never send to a server.

## Frequently asked questions

### Is a browser-based tool really more private than a normal online tool?

For the specific question of "does my file get uploaded," yes — a client-side tool processes your file on your own device, so it doesn't travel across the network at all. A typical upload-based tool sends your file to a server to do the work.

### Do I need to trust that the file isn't uploaded?

You can verify it rather than trust it. Load the tool, disconnect from the internet, and try using it. If it still works, your file isn't going anywhere online.

### Does an in-browser tool work offline?

Once the page has loaded, yes — the work happens on your device, so many in-browser tools keep functioning without a connection. That's also a handy way to confirm nothing is being uploaded.

### Where can I find these tools?

They're all listed in the [tools hub](/tools). Pick the one you need — each processes your files entirely in your browser.

Your files never leave your browser — everything happens on your own device.
