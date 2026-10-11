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

If it still works with no connection, the file isn't being uploaded anywhere — there's nowhere for it to go.

One catch: some tools download extra code the first time you use them. Our PDF tools fetch their PDF library when you first press the button, so if you disconnect before that, the first attempt fails even though nothing would have been uploaded. Use the tool once with a harmless file while online, then disconnect and try again.

## Checking with your browser's developer tools

The offline test tells you the tool *can* work without the network. Your browser's network panel shows exactly what it *does* send. These steps are for Chrome and Edge on a computer; Firefox and Safari have the same panel under similar names.

1. Open the tool page, for example [Merge PDF](/tools/merge-pdf).
2. Press **F12** (on a Mac, **Cmd+Option+I**) and choose the **Network** tab.
3. Tick **Preserve log**, then click the clear button (a circle with a line through it) so the list is empty.
4. Use the tool with your files.
5. Look at the list. The **Method** column is hidden by default: right-click any column header and tick **Method**. An upload usually shows as a **POST** or **PUT** request, with a size close to your file's size. A tool that works locally shows only **GET** requests, which fetch code, fonts and images.
6. Click any request you are unsure about and open its **Payload** tab. A GET request has no payload.

## What we saw when we did this

On 11 October 2026 we ran this check on the live [Merge PDF](/tools/merge-pdf) page in Chromium 152, after rejecting optional analytics in the cookie banner. We merged two small test PDFs, each containing the made-up marker word `TEKIVEX-PRIVACY-CHECK-7731`, and recorded every request.

| What we checked | Result |
|---|---|
| Requests made while merging | One: a GET for the PDF library, 179 KB, from www.tekivex.com |
| Requests that carried any data out (POST, PUT, beacon or similar) | None |
| Requests containing the marker word | None |
| Requests to any server other than www.tekivex.com | None |
| Where the merged file was | A `blob:` address, which exists only inside your browser tab |

The [full log](/examples/tool-tests/privacy-network-log.json) is published. Two limits apply. We tested Merge PDF, not every tool, and we did not repeat the test with analytics accepted. The steps above let you check any tool yourself, in your own browser, on your own files.

## Tekivex's tools all work this way

Every free tool in the Tekivex [tools hub](/tools) is built to run client-side. Your files are processed in your browser and are never uploaded. That includes [Merge PDF](/tools/merge-pdf), [Split PDF](/tools/split-pdf), [JPG to PDF](/tools/jpg-to-pdf), [Compress PDF](/tools/compress-pdf), and [CSV to Chart](/tools/csv-to-chart). Even the CSV chart tool's "share a link" feature keeps your data in the part of the URL after the `#`, which browsers never send to a server.

## What a traditional upload tool does with your file

To appreciate the difference, walk through what happens with a conventional "free online PDF tool". You pick a file; it travels over the internet to the company's server; the server processes it and holds the result until you download it. At minimum, your document has now existed on hardware you don't control, subject to that company's retention policy, logging, staff access rules, and breach history — none of which you can verify. Many such services promise deletion "within a few hours", which still means your contract, medical record, or ID scan sat on a third-party machine for a few hours. For throwaway documents that may be fine. For anything sensitive, it's a real cost that the convenience hides.

There's a second-order issue, too: uploads create copies. Server-side processing typically produces the original, the converted result, temporary working files, and backups of all three. "Delete" rarely means all of them, immediately, everywhere.

## The trade-offs, stated honestly

In-browser processing isn't magically better at everything. Your device does the work, so a low-memory phone can struggle with a 500-page scan that a beefy server would shrug at. Features that genuinely require heavy infrastructure — OCR on huge batches, format conversions needing licensed engines — are harder to deliver client-side. The honest summary: for the common tasks these tools cover, local processing gives you equal results with a categorically better privacy model; for industrial-scale jobs, a server-based tool may be the right call, chosen with eyes open.

## Frequently asked questions

### Is a browser-based tool really more private than a normal online tool?

For the specific question of "does my file get uploaded," yes — a client-side tool processes your file on your own device, so it doesn't travel across the network at all. A typical upload-based tool sends your file to a server to do the work.

### Do I need to trust that the file isn't uploaded?

You can verify it rather than trust it. Load the tool, use it once while online so it can fetch its code, then disconnect and try again. If it still works, your file isn't going anywhere online. For a more exact check, watch the Network tab in your browser's developer tools while you use the tool, as described above.

### Does an in-browser tool work offline?

Once the page has loaded, yes — the work happens on your device, so many in-browser tools keep functioning without a connection. That's also a handy way to confirm nothing is being uploaded.

### Where can I find these tools?

They're all listed in the [tools hub](/tools). Pick the one you need — each processes your files entirely in your browser.

Your files never leave your browser — everything happens on your own device.
