---
title: The Story Behind My Swift Student Challenge Winning Submission
date: 2026-07-08
description: "A three-minute SwiftUI journey inspired by my grandfather's diaries, exploring memory, immigration, and the shift from historical to modern Japanese."
tags:
  - swift
  - apple
---

# The Story Behind My Swift Student Challenge Winning Submission

![Certificate](/media/SSC/certificate.jpeg)

## Introduction

In 2026, I was interning at MIXI’s app [FamilyAlbum](https://family-album.com/) in their DAD Team, working with other iOS developers. It was my first internship experience, and I had the opportunity to see how other developers work in a real company environment. I also learned how to work in a team and collaborate with other developers.

During my internship, I had the chance to attend some events at Apple Japan targeted at students who wanted to participate in the [Swift Student Challenge](https://developer.apple.com/swift-student-challenge/). I attended those events, but actually, I had already participated in the Swift Student Challenge the previous year with my app [[Swift Student Challenge 2025|NeoMnemo]], and because I was quite busy with my internship this year, I was not planning to participate again. I was thinking of trying again the following year.

As I had been learning Taiwanese Mandarin for a while, I had always noticed the lack of a great native and modern Mandarin dictionary app, like Monokakido’s [“Dictionaries”](https://www.monokakido.jp/en/dictionaries/app/index.html) app. Because I could not find other good options, I always wanted to build one myself. That was the only app idea I had in mind at first.

But I kind of knew that this app would not be suitable for the Swift Student Challenge, because the challenge explicitly says that the app has to be [experienced within three minutes](https://developer.apple.com/swift-student-challenge/get-ready/). I knew I could implement a simple version of a dictionary app, but the idea itself was a little weak for the challenge. It was a great app idea, but not suitable for the Swift Student Challenge.

Afterwards, while going in this educational direction, I remembered that I had gone to Taiwan the previous year and bought this postcard.

![The postcard I bought in Taiwan](/media/SSC/postcard.jpeg)

I started learning Traditional Chinese around five years ago and began studying [Zhuyin](https://en.wikipedia.org/wiki/Bopomofo) around two years ago. I always found it interesting as a person who knows Japanese, because of how similar it is to Japanese kana. I wanted to build a Duolingo-style app, with each letter being an animated character, and make it a fun experience for kids and foreigners learning Zhuyin. That was the best idea I had in mind at that time.

In the same week, I attended the event for students at Apple Japan. I met many student developers from other countries and got the chance to talk to lots of them. I saw how important it is to include your personal story, your uniqueness, and who you are, and blend it with a catchy and inspiring story. I also realized the importance of creating a good experience with fluid animations and visuals, while improving the user experience and including accessibility-related features.

In this article, I will explain how I managed to go from my first idea to the final product in one month.

## The Idea

I was reflecting on the apps I saw at the Apple Japan event, and I was also thinking about my trip back home to Brazil last year. I do not know the exact reason, but I remembered my father going to the basement of my home and bringing me some old documents from my grandfather, along with three diaries he had written.

My dad showed them to me and asked: “Can you read these?”

My dad is Japanese Brazilian, second generation, and he grew up in Brazil his whole life. He can understand Japanese because of his family, but he cannot read or write it. I knew how to read some of the characters because of my knowledge of Traditional Chinese, but this was surely different from modern Japanese.

At the same time, I thought about how nowadays, the Japanese community is getting weaker with the newer generations of Japanese Brazilians. Many people like me, even though our families came from Japan, feel really disconnected from the culture and language.

I thought I could improve on that by connecting newer generations of Japanese Brazilians to their roots. I wanted to teach them the story of immigration, make them feel the emotion of how hard the trip and the preparation to go to Brazil were, and most importantly, teach them the differences in how Japanese was written back then.

The app would be for people who were already learning Japanese and wanted to start learning older forms of Japanese writing. It could also introduce the transition from [kyujitai](https://en.wikipedia.org/wiki/Ky%C5%ABjitai) to [shinjitai](https://en.wikipedia.org/wiki/Shinjitai), and show how the language changed from that time to modern Japanese.

## Prototyping

The first thing I thought about was finding a table that converts shinjitai to kyujitai. That was a great way to get a super simple demo of the app.

I then ended up with a really simple prototype. A phrase appears with some kanji highlighted. Then, several options appear at the bottom in a grid, and the user has to tap the correct version of the kanji character.

![Early prototype: tap the correct version of the highlighted kanji](/media/SSC/Beta.png)

I then tried to implement an algorithm to add difficulty to the app. I tried to look for algorithms that could measure the similarity of kanji characters. For example, in the hard mode of the app, I wanted to display kanji characters with the same radical.

I thought this app was kind of interesting, but it felt more like a game or quiz app. It was not a real immersive experience, and that is one of the things I learned from building a successful submission.

## Building an Immersive Experience

The first thing I thought about was building a nice onboarding screen to make the user get into the story.

I added an onboarding screen that briefly tells the story of who I am and explains that I went to the basement of my home in Brazil. This was a good way to introduce myself and put the player into the story.

![Onboarding](/media/SSC/Onboarding.png)

After that, I added an interactive scene. In this scene, some objects appear in the basement, such as tires and papers, and the user has to move those objects around to reveal what is underneath. I also added a tip to that screen, in case the user does not know that they have to move the objects around, since it is not an explicit action.

![The interactive basement scene](/media/SSC/Interaction.png)

After the diary is revealed, a glowing and mysterious effect appears behind it to show the user that this is not a normal object. And it is true: the user can tap the diary, enter inside it, and go back in time to follow my grandfather’s journey to Brazil.

![Spiral](/media/SSC/Spiral.gif)

I also added narration boxes so that the user could see my emotions and what I was thinking during the whole story. This made me the narrator of the story. I also added illustrations for each scene and created a visual language design for the cards.

## The Diary Entries

I wanted to create an authentic story for the diary entries, so I decided to visit the [Japanese Overseas Migration Museum](https://www.jica.go.jp/english/domestic/jomm/outline/index.html) in Yokohama, run by [JICA](https://www.jica.go.jp/english/). The museum contains several documents related to Japanese immigration to other countries, such as the USA, Peru, and Brazil.

<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <img src="/media/SSC/JICA_building.jpeg" alt="The JICA Japanese Overseas Migration Museum in Yokohama" style="flex: 1 1 0; width: 0; min-width: 12rem; height: 18rem; object-fit: cover; border-radius: 8px;" />
  <img src="/media/SSC/JICA_documents.jpeg" alt="Immigration documents I read at the museum library" style="flex: 1 1 0; width: 0; min-width: 12rem; height: 18rem; object-fit: cover; border-radius: 8px;" />
</div>

I asked for diaries, books, and collections, and spent the whole day in the library reading the documents. At that moment, while reading the letters and documents, I thought that even if I did not win this challenge, I had already gained something really important: the chance to know the feelings of the people from Japan who came to Brazil.

This is something I had always wanted to see and read, and it was a valuable experience that was already worth it by itself. I went back home and kept reading those entries nonstop. I was actually really eager to make the app after that.

## Putting It All Together

After reading those entries, I went back home with a new perspective for my app. I read all of the entries I had seen in the museum and tried to combine parts of them to make an authentic story for my app.

At that point, the app was no longer just about teaching the difference between shinjitai and kyujitai. It became a story about memory, language, and reconnecting with my roots. I combined the diary-inspired story with my own emotional narration and illustrations, and slowly the experience started to feel more complete.

![Card](/media/SSC/Card.png)

Instead of only showing old characters and asking the user to choose the correct answer, I wanted the user to feel like they were entering a memory and discovering the text together with me. That was when the app started to become more than a quiz. It became a short interactive journey.

![Game](/media/SSC/Game.png)

## Details That Made the Experience Better

After the main story was finished, I started focusing on the details that would make the experience feel smoother and more intentional.

One of the key details was the panel at the top of the screen for modern Japanese. When the user tapped a word written in the old script, the modern version of that word would automatically appear and animate inside the panel. I wanted this to feel as if the user was rediscovering the modern text from the old writing.

![Panel](/media/SSC/Panel.gif)

I also focused on the animations throughout the whole experience. The glowing effect behind the diary, the movement of objects in the basement, and the way the text appeared were all meant to make the app feel more immersive.

At the same time, I wanted to make sure the experience would still be comfortable for different users. I added support for [Dynamic Type](https://developer.apple.com/design/human-interface-guidelines/accessibility#Text-display) so that the text could adapt to the user’s preferred text size. I also handled [Reduce Motion](https://developer.apple.com/design/human-interface-guidelines/motion) in [SwiftUI](https://developer.apple.com/documentation/swiftui), so users who prefer less motion could still experience the app without depending too much on animations. This was important because the app was very visual and animated, but I did not want the experience to become uncomfortable or inaccessible.

Another important detail was the ending dialogue. I did not want the experience to simply stop after the adventure ended. I wanted to give the user a small emotional conclusion, so the story would feel complete.

![Ending](/media/SSC/Ending.png)

Finally, I measured the average time of the whole experience to make sure it stayed under the three-minute limit. This helped me keep the scope focused and avoid adding features that would make the app too long or too complicated.

## Lessons Learned

I had already learned a lot from the experience of making this app. It was not only about the structure and code of the project. It was also about my identity and the whole process I had gone through until the final result I submitted.

I also noticed once again that being part of the community is really important because it inspires you and makes you feel that you are not alone. The reason I got the motivation and inspiration to submit my app this year was that I had joined the event at Apple Japan. I would not have been able to win if I had not asked people from the community about their app ideas.

The biggest lesson I learned is that a strong Swift Student Challenge submission is not only about technical complexity. It is about building something meaningful, focused, and personal. The best idea is not always the biggest idea. Sometimes, the best idea is the one that only you could have made.
