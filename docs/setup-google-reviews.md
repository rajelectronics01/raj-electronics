# How to Setup Google Reviews

To display real reviews, we need 2 things from Google:
1.  **Google Maps API Key**
2.  **Place ID** (The ID of your shop on Google Maps)

## Step 1: Get the API Key
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., named "Raj Electronics Web").
3.  Click on the menu (≡) > **APIs & Services** > **Library**.
4.  Search for **"Places API (New)"** and click **Enable**.
    *   *Note: You may need to enable billing. Google gives $200 free credit every month, which handles ~100,000 requests (more than enough for us).*
5.  Go to **APIs & Services** > **Credentials**.
6.  Click **Create Credentials** > **API Key**.
7.  **Copy this key**. (e.g., `AIzaSy...`)

## Step 2: Get Your Place ID
1.  Go to the [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id).
2.  Search for "Raj Electronics" (and your city/area) in the map search bar.
3.  Click on your business marker.
4.  Copy the **Place ID** shown in the pop-up (looks like a long string of random characters).

## Step 3: Add to Website
1.  Open the `.env.local` file in your project (create it if it doesn't exist).
2.  Add these lines:
    ```env
    GOOGLE_PLACES_API_KEY=your_api_key_here
    GOOGLE_PLACE_ID=your_place_id_here
    ```
3.  Restart your server.
