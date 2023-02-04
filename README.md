# Korero: A simple Collaborative Commenting Tool

WIP

### Why Firebase?

Well, a lot of the people who stumble upon this library later will ask “Why Firebase?” followed with “_Why not Supabase?_” or something like “_Why not Mongo or REST Based setup?_”

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

process.env.SHOW_KORERO && <script src="https://cdnjs.com/.../korero.min.js" />;

// and then
if (process.env.SHOW_KORERO && window.korero) {
	new Korero({ firebaseCredentials }).initialize();
}
```

### Why the constructor syntax and not an embeddable component?

One might wonder, with all the JSX in the world, why is a UI-level feature library like Korero using a constructor syntax.

The answer is compatibility. I wanted Korero to function in any environment, even a simple HTML-CSS website opened via a File URL should be able to run it. It should be agnostic to the Framework or library that’s consuming it.

Korero does use React internally but the only thing the end-consumer has to worry about is to call `initialize` on the Korero class.
