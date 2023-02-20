# 💬 Korero: A simple Collaborative Commenting Tool

Ever used Figma? Or better yet, Vercel's preview builds [with comments](https://vercel.com/blog/introducing-commenting-on-preview-deployments). I was mesmerized with how seamless and beautiful they were. So this repository is a personal project to make the same setup available as an open-source distributable for everyone to use, especially those who do not use Vercel.

### Features

- Real-time comments and threads page-wide, anywhere on the page.
- Presence Indicators to tell you who's live.
- Real-time selections and notes on the page with commenting attached to them.
- Device Information available on each comment for easier debugging.

### Required setup

1. Create a [Firebase Project](https://console.firebase.google.com/) and create a web project inside it.
2. Enable Firestore in the project, navigate to `Rules` and paste the following:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  	function isSignedIn() {
        let allowedEmailRegex = '...';  // You can remove this if you want anyone on your project to be able to comment.
    	return request.auth != null &&
            request.auth.uid != null &&
            request.auth.token.email.matches(regex);    // Can be removed
    }

    match /korero-comments/{commentId} {
      allow read, create, update, delete: if isSignedIn();
    }

    match /korero-presence/{url} {
      allow read, create, update: if isSignedIn();
    }
  }
}
```

3. Enable Firebase Authentication and choose any of Google or GitHub based Sign In Options. Firebase Authentication has 0 config setup for Google so it would be easier to setup.

### Intialization

First copy your Firebase config from your project's dashboard:

```javascript
const firebaseCredentials = {
  apiKey: ...,
  projectId: ...,
  ...
};
```

Simply include the Korero snippet as a script tag in your page:

```html
<script type="text/javascript" src="https://unpkg.com/korero/umd.js"></script>
<script type="text/javascript">
	const koreroInstance = new korero({ firebaseCredentials }).initialize();
</script>
```

Or include Korero as a dependency in your project:

```bash
npm i korero
```

```javascript
import Korero from "korero";

const koreroInstance = new korero({ firebaseCredentials }).initialize();
```

### Configuration Options

Configuration for your Korero instance can be passed as `options` in the argument object.

| Argument Name          | Required | Type                | Description                                                                                                                                                                                               |
| ---------------------- | -------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedSignInMethods` | Yes      | `String[]`          | Array of sign-in methods. Possible values: `google`, `github`                                                                                                                                             |
| `isUserAllowed`        | No       | `(User) => Boolean` | Function that receives the user object after sign-in, should return a promise that resolves with a boolean of whether the user is allowed to use Korero or not                                            |
| `currentSiteVersion`   | No       | `String`            | A simple string that can help determine changes between two site versions, this is for the times you want to ensure comments added on one version of the page do not show up on an older or newer version |
| `whitelistedHosts`     | No       | `String[]`          | A set of hosts your Korero instance is allowed to run.                                                                                                                                                    |

### Handling Route Change

When your users change routes, you would want the current comments list to go away. The setup built-in with Korero works as expected for most applications, but you would have to add some more configuration for it to work with frontend frameworks and libraries that handle user routing on the client-side.

Refer to your framework-specific guide on listening to route changes.

For example, you would do something like this with Next.js:

```javascript
const { pathname } = useRouter();

useEffect(() => {
	koreroInstance.unmount();
	koreroInstance.initialize();
}, [pathname]);
```

### Why Firebase?

Well, a lot of the people who stumble upon this library later will ask “Why Firebase?” followed with “Why not Supabase?” or something like “Why not Mongo or REST Based setup?”

Well the reasons are quite simple and straightforward:

- Firestore (Or any NoSQL database for that matter) gives you the flexibility to update your data schema as requirements change. Since Korero aims to be a snippet-based or distributable and installable library, a simple Korero version update with the required changes at a schema level will take care of it for the end consumers.
- Firestore has an edge over other NoSQL databases as the requirements for defining collections are extremely relaxed, you don’t even need to have the collection existing in order for it to be automatically created whenever a write to that collection goes through.
  Speaking of SQL databases, Supabase uses Postgres as a database which is obviously much more powerful than Firebase ever will be, but requires you to tediously define table schemas and security rules.
- Firestore and its companions like Firebase Authentication and Storage do not require any backend-level intervention and work extremely well among each other, everything you need to do can be securely performed on the frontend.
- Real-time capabilities of Firestore are unmatched, no other open-use database I have worked with before has real-time capabilities as simple and as reactive as the ones Firestore offers.
- The time to setup and start using Firebase is extremely small and given its extremely generous pricing tier, no team should ever have to worry about having to pay for a Firebase Project that their Korero setup depends on.

### Why is the bundle size so big?

You might have noticed the bundle size for Korero is pretty big, but that’s actually not by design.

Korero’s core size is less than 20 KB, the remaining size is only because of the intrinsic size of the Firebase Client SDKs that are used to make the features work.

That being said, given Korero is a collaborative commenting system, chances are you’ll be using it for development and feedback-receiving environments where the devices and environments people will use your apps would be predictable (Like inside a team with standardized laptop and similar internet setups), the bundle size is not that big of a deal.

If you want to prevent your overall app’s bundle size from bloating up, prefer using the CDN snippet for Korero and have the script load behind a feature or an environment flag.

```jsx
import Korero from "korero"; // Adds size of korero to bundle.

// Do this instead

process.env.SHOW_KORERO && <script src="https://unpkg.com/korero/umd.js" />;

// and then
if (process.env.SHOW_KORERO && window.korero) {
	new korero({ firebaseCredentials }).initialize();
}
```

### Why the constructor syntax and not an embeddable component?

One might wonder, with all the JSX in the world, why is a UI-level feature library like Korero using a constructor syntax.

The answer is compatibility. I wanted Korero to function in any environment, even a simple HTML-CSS website opened via a File URL should be able to run it. It should be agnostic to the Framework or library that’s consuming it.

Korero does use React internally but the only thing the end-consumer has to worry about is to call `initialize` on the Korero class and it will work with any library, any framework.

### Contribution and Feedback

Contributions are welcome, just fork the repository and make the change you please and open a pull-request.

For feedback and bugs, open an issue or discussion on this repository.
