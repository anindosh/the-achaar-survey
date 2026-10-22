# The Achaar Survey 🌶️🫙

A playful survey site that shows one question per screen and fills a spice meter as you go. Every response is added as a row to a Google Sheet that only you can see.

```
index.html      page structure (home → questions → thank you)
styles.css      look & feel (home layout matches the 390 × 844 mockup)
app.js          survey logic and sending answers
questions.js    ✏️  the questions; edit these freely
config.js       ✏️  paste your Google Sheet web-app URL here
apps-script/Code.gs   script that lives inside your Google Sheet
assets/         images and the Start Survey button
```

## 1. Connect your Google Sheet (about 5 minutes)

1. Go to [sheets.new](https://sheets.new) and create a new sheet, e.g. **Achaar Survey Responses**. Keep it private: don't share it with anyone.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete what's there, paste in everything from [`apps-script/Code.gs`](apps-script/Code.gs), and click **Save**.
4. Click **Deploy → New deployment**, then click the gear ⚙️ and choose **Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy** and approve the permissions. Google will warn that the app "isn't verified" because you wrote it yourself. Click **Advanced → Go to … (unsafe)**.
6. Copy the **Web app URL** (it ends in `/exec`) and paste it into `config.js`:
   ```js
   SHEET_ENDPOINT: "https://script.google.com/macros/s/XXXX/exec"
   ```
7. Commit and push. The first submission creates a **Responses** tab with a header row.

**Check it works:** open the web app URL in a private/incognito window. You should see `"ok":true`. If you get a Google sign-in page instead, the deployment isn't set to **Who has access: Anyone**, and the survey can't save answers.

**Who can see what:** "Anyone" only means anyone can *send* answers to the script. The script can only add rows. Visitors can't read the sheet, and the sheet itself is shared with no one.

> If you change `Code.gs` later, use **Deploy → Manage deployments → ✏️ → Version: New version**. That keeps the same URL.

### WhatsApp button

The final screen's WhatsApp button opens a chat with you. Put your number in `config.js` as digits with the country code, e.g. `WHATSAPP_NUMBER: "919876543210"`, and change `WHATSAPP_MESSAGE` to set the pre-filled message.

## 2. Put the site online (GitHub Pages)

1. In this repo on GitHub, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, then pick your branch and the `/ (root)` folder.
3. After a minute your survey will be live at `https://<your-username>.github.io/the-achaar-survey/`.

## 3. Change the questions

Edit `questions.js`. Question types:

| type       | what it looks like                        |
|------------|-------------------------------------------|
| `text`     | one-line answer                           |
| `longtext` | big text box                              |
| `email`    | email field with validation               |
| `single`   | pick one (moves on automatically)         |
| `multi`    | pick several, stacked cards (`max` caps it) |
| `chips`    | pick several, compact pills               |
| `spice`    | 1–5 chilli slider                         |

Each question's `column` is its header in the sheet. New questions are added as new columns at the end automatically.

## Try it locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```
