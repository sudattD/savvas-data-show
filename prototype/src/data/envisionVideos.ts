// AUTO-GENERATED · do not edit by hand.
// Source: /tmp/probe-savvas/bake-videos.mjs
// Pulls from /Users/dereklomas/Downloads/savvas-envision-3act-videos/{manifest.json, transcripts/*.md}
//
// Each row is one of the 35 enVision AGA 2024 3-Act Math Act-1 videos —
// official Savvas content extracted from QR codes in the printed textbook
// and transcribed with Gemini 3 Flash on 2026-05-11.

import type { CourseId } from './chapters';

export interface EnvisionVideo {
  course: CourseId;
  topic: number;
  /** Short slug like "A1-T08" — matches the poster file name in /public/envision-posters/. */
  tag: string;
  /** Savvas internal title (e.g. "AGA24 A1 T8 MM3A Act 1 Video with Questions"). */
  title: string;
  /** Savvas's name for the story ("The Long Shot", "What Note Was That?", etc.). */
  learningObjective: string;
  /** Direct MP4 URL on Pearson's CDN. */
  videoUrl: string;
  durationSec: number | null;
  /** 2-3 sentence visual description from Gemini transcription. */
  premise: string;
  /** Verbatim spoken dialogue (often "(no spoken dialogue)" for music-only videos). */
  spokenTranscript: string;
  /** Bulleted list of on-screen text. */
  onScreenText: string;
  /** The math question the video poses. */
  mathQuestion: string;
  /** 2-3 sentence summary of what Acts 2 and 3 would compute. */
  studentNeed: string;
}

export const ENVISION_VIDEOS: EnvisionVideo[] = [
  {
    "course": "algebra1",
    "topic": 1,
    "tag": "A1-T01",
    "title": "AGA24 A1 T1 MM3A Act 1",
    "learningObjective": "Collecting Cans",
    "videoUrl": "https://us-school.pk12ls.com/school/d3da5650-b09c-44e3-92d5-fc0571a1ea76/A0836367/auth/asset/AVA618000.mp4",
    "durationSec": null,
    "premise": "Four students named Angela, Brian, Carlos, and Danielle stand behind a table in a classroom, each holding a black plastic bag. They take turns shaking their bags, which produce loud rattling sounds like metal cans clinking together, as they discuss their success in a collection drive.",
    "spokenTranscript": "[ crinkling bags, rattling cans ] >> I think we did really well. [ rattling cans ] >> Sure sounds like it.",
    "onScreenText": "* Angela\n* Brian\n* Carlos\n* Danielle",
    "mathQuestion": "Who collected the most cans?",
    "studentNeed": "Students need to determine a method for comparing the quantities of cans inside the four opaque bags. They will need to use information provided in subsequent acts—such as the weight of the bags or the specific number of cans each person collected—to calculate totals and identify who has the greatest amount."
  },
  {
    "course": "algebra1",
    "topic": 2,
    "tag": "A1-T02",
    "title": "AGA24 A1 T2 MM3A Act 1",
    "learningObjective": "How Tall Is Tall?",
    "videoUrl": "https://us-school.pk12ls.com/school/46a7368b-1252-42e7-ba70-62343159968e/A0836418/auth/asset/AVA761625.mp4",
    "durationSec": null,
    "premise": "Jay, a tall man, is shown playing basketball on an outdoor court. The video uses humorous visual comparisons to illustrate his height, stacking sheep, babies, and teachers next to him before starting a stack of plastic cups to measure him.",
    "spokenTranscript": "[ background music ]",
    "onScreenText": "* This is Jay.\n* He's tall.\n* 5 sheep\n* 6 babies\n* 1.5 teachers\n* 1 cup\n* 2 cups\n* 3 cups\n* 4 cups\n* 5 cups\n* 6 cups\n* 7 cups",
    "mathQuestion": "How many cups tall is Jay?",
    "studentNeed": "Students need to determine the total number of cups required to reach the top of Jay's head. This involves modeling a linear relationship where the first cup provides a base height, and each additional cup adds a consistent, smaller increment of height as they nest together. Students will need to use the visual scale of the first seven cups to estimate or calculate the remaining cups needed to reach Jay's full height."
  },
  {
    "course": "algebra1",
    "topic": 3,
    "tag": "A1-T03",
    "title": "AGA24 A1 T3 MM3A Act 1",
    "learningObjective": "The Express Lane",
    "videoUrl": "https://us-school.pk12ls.com/school/25e35389-fcef-40fc-9dc1-cba28e277e4a/A0836460/auth/asset/AVA618006.mp4",
    "durationSec": null,
    "premise": "The video shows a supermarket checkout area with seven lanes, most of which are closed. The camera pans to Lane 1, the \"Express Lane,\" where three green shopping carts are lined up. A series of red shopping baskets then begins to line up parallel to the carts, one by one, until a question mark appears at the end of the basket line.",
    "spokenTranscript": "(no spoken dialogue)",
    "onScreenText": "* 7, 6, 5, 4, 3, 2, 1 (lane numbers)\n* CLOSED\n* Cold Soft Drinks\n* EXPRESS\n* EXPRESS LANE\n* ?",
    "mathQuestion": "How many baskets have the same length as the 3 carts?",
    "studentNeed": "Students need to determine the relationship between the length of a single shopping cart and a single shopping basket. They will need to know the specific measurements of one cart and one basket to calculate how many baskets are required to match the total length of the three carts shown in the express lane."
  },
  {
    "course": "algebra1",
    "topic": 4,
    "tag": "A1-T04",
    "title": "AGA24 A1 T4 MM3A ACT 1",
    "learningObjective": "Get Up There!",
    "videoUrl": "https://us-school.pk12ls.com/school/8d64431e-5a43-4b65-9292-8fe40bb8d0be/A0836531/auth/asset/AVA618009.mp4",
    "durationSec": null,
    "premise": "Two office workers, a woman in a pink shirt and a man in a blue shirt, are working in their cubicles when they receive an email about a rooftop party with free food. They both immediately rush out of their desks and run to the elevators to head to the roof. The video ends with them entering separate elevators and the doors closing as they begin their ascent.",
    "spokenTranscript": "[typing & stamping] [email ding] [music under]",
    "onScreenText": "* Email Inbox\n* Davidson, Kristin: Rooftop Office Party right NOW...with FREE FOOD!\n* Paperman, Mary: Student Council Fun Run Meeting\n* Johnson, Gary: Fun Run Organizing\n* Hedges, Jason: Volunteer for Fun Run\n* Williams, Derek: Joe Tennerman assigned to review\n* Keller, Candice: Problems with last night's homework\n* Tennerman, Joe: Teacher Review Thursday, January 24th\n* Nelson, Alex: Questions on math homework\n* Daley, Ginnie: Confused on homework",
    "mathQuestion": "Who will get to the rooftop party first?",
    "studentNeed": "Students need to determine the starting floor for each person and the destination floor of the rooftop. They will also need to know the speed of each elevator, likely measured in seconds per floor or floors per second. Using this data, they can calculate and compare the total travel time for both individuals to see who arrives at the party first."
  },
  {
    "course": "algebra1",
    "topic": 5,
    "tag": "A1-T05",
    "title": "AGA24 A1 T5 MM3A ACT 1",
    "learningObjective": "The Mad Runner",
    "videoUrl": "https://us-school.pk12ls.com/school/8c839415-2cd4-44ed-98bf-17c164566d00/A0836554/auth/asset/AVA618012.mp4",
    "durationSec": null,
    "premise": "A young man prepares to run across a large, grassy park. As he runs, a graph of speed versus time is overlaid on the screen, but the runner reacts with confusion and frustration as the graph's shape fails to match his actual physical movement.",
    "spokenTranscript": "Alright, let's go. Let's do this. Whoa! Whoa! oh, wait! What? Would you get it right this time, please!",
    "onScreenText": "* 0.33 through 12.00 (Time markers)\n* Speed (Graph y-axis)\n* Time (Graph x-axis)\n* 0, 2, 4, 6, 8, 10, 12 (Time axis labels)",
    "mathQuestion": "Does the graph accurately represent the runner's speed over time?",
    "studentNeed": "Students need to analyze the runner's motion to determine when he is accelerating, maintaining a constant speed, or decelerating. They must then evaluate the provided line graph to see if its slopes and curves correctly model those changes in speed over the 12-second duration. Finally, they will likely need to construct a more accurate graph based on their observations of the video."
  },
  {
    "course": "algebra1",
    "topic": 6,
    "tag": "A1-T06",
    "title": "AGA24 A1 T6 MM3A ACT 1",
    "learningObjective": "Big Time Pay Back",
    "videoUrl": "https://us-school.pk12ls.com/school/da0c7826-c5c2-4ccd-a78e-6d0c18a36454/A0836635/auth/asset/AVA618015.mp4",
    "durationSec": null,
    "premise": "A woman in a futuristic setting attempts to withdraw money from a bank, only to find her account is empty. She uses a time-travel device to return to the present day, where she opens a \"Super Saver\" account with a $100 deposit at 5% interest. Upon returning to the future, the bank teller informs her that her balance has grown to nearly $100 million.",
    "spokenTranscript": "[ Foot steps ] >> Hi, how can I help you today? >> I'd like to withdraw everything in my account, please. >> Okay. I'm sorry, the account is empty. [ Futuristic sound effects ] [ Music ] >> Oh! >> Hi, how can I help you today? >> I'm here to open an account. I'd like to take advantage of your Super Saver promotion. >> Okay, I'll just need an initial deposit. >> Here you go. >> Fill this out and I'll get you all set up. >> Okay, you're all set. [ Futuristic sound effects ] >> Say, what's with the weird outfit? >> Hi, how may I help you? >> I'd like to withdraw everything in my account, please. >> Alright. Um...how did you...? [ Futuristic sound effects ] [ Music ] >> Oh! >> Hi, how can I help you today? >> I'm here to open an account. I'd like to take advantage of your Super Saver promotion. >> Okay, I'll just need an initial deposit. >> Here you go. >> Fill this out and I'll get you all set up. >> Okay, you're all set. [ Futuristic sound effects ] >> Say, what's with the weird outfit? [ Futuristic sound effects ] >> Hi, how may I help you? >> It appears you have a balance of just under $100 million in your account. I'm going to have to contact my manager. >> Take your time.",
    "onScreenText": "* Many years from now\n* Present day\n* Super Saver! $100 initial deposit. 5% interest compounded annually. Watch your money grow!",
    "mathQuestion": "How many years did the woman travel into the future?",
    "studentNeed": "Students need to model the growth of the bank account using the compound interest formula $A = P(1 + r)^t$. Using the given values ($P = 100$, $r = 0.05$, and $A \\approx 100,000,000$), they must solve for the time variable $t$ to find the duration of the woman's time travel."
  },
  {
    "course": "algebra1",
    "topic": 7,
    "tag": "A1-T07",
    "title": "AGA24 A1 T7 MM3A ACT 1",
    "learningObjective": "Who's Right?",
    "videoUrl": "https://us-school.pk12ls.com/school/4aae3557-4238-4ba6-ab77-1e2fb5d1dac8/A0836689/auth/asset/AVA618018.mp4",
    "durationSec": null,
    "premise": "Four students—Angela, Brian, Carlos, and Danielle—are shown in a four-way split screen working on a math problem. They each write a factored algebraic expression on a small whiteboard and hold it up for the camera. The narrator observes that they have all produced different answers and asks if they can all be right.",
    "spokenTranscript": ">> How's everybody doing? When you've got your answer, write it nice and big on your whiteboard. [ Music ] >> Okay, looks like everyone's finished. Let's see what you got. Ooh...I like all of these answers, but you can't all be right, right? >> I got the right answer. >> I really think I got this. >> I think this is the right answer. >> I know I got this right.",
    "onScreenText": "* Angela\n* Brian\n* Carlos\n* Danielle\n* Angela's board: $(2x^2 - 6x)(x + 5)$\n* Brian's board: $(x - 3)(2x^2 + 10x)$\n* Carlos's board: $2x(x - 3)(x + 5)$\n* Danielle's board: $(x^2 + 2x - 15)(2x)$",
    "mathQuestion": "Which student has the correct answer?",
    "studentNeed": "Students must determine if the four different factored expressions are equivalent by expanding them into standard polynomial form. They will need to use algebraic properties to show that all four expressions represent the same polynomial, $2x^3 + 4x^2 - 30x$. Finally, they must decide which expression represents the polynomial factored completely."
  },
  {
    "course": "algebra1",
    "topic": 8,
    "tag": "A1-T08",
    "title": "AGA24 A1 T8 MM3A Act 1 Video with Questions",
    "learningObjective": "The Long Shot",
    "videoUrl": "https://us-school.pk12ls.com/school/984b6f43-50dd-4afc-955e-41576ec26f33/A0836750/auth/asset/AVA618021.mp4",
    "durationSec": null,
    "premise": "A young woman practices basketball on an outdoor court, performing dribbling drills before taking a series of jump shots. The video shows six different shots from the same location, with each ball's path traced by a sequence of frozen images to highlight the varying arcs.",
    "spokenTranscript": "(no spoken dialogue)",
    "onScreenText": "* Shot 1\n* Shot 2\n* Shot 3\n* Shot 4\n* Shot 5\n* Shot 6",
    "mathQuestion": "Which shot is most likely to go in the basket?",
    "studentNeed": "Students will need to analyze the parabolic trajectories of the six different basketball shots. They must use the visual data to model the paths mathematically, likely using quadratic functions, to determine which arc is most likely to result in a successful basket."
  },
  {
    "course": "algebra1",
    "topic": 9,
    "tag": "A1-T09",
    "title": "AGA24 A1 T9 MM3A ACT 1",
    "learningObjective": "Unwrapping Change",
    "videoUrl": "https://us-school.pk12ls.com/school/1d5509e9-72af-4740-949c-1b8efe874edc/A0836821/auth/asset/AVA618024.mp4",
    "durationSec": null,
    "premise": "A young woman sits on a hardwood floor and begins emptying rolls of pennies from a blue basket. She carefully spreads the coins out into a large, circular arrangement, repeating the process with several rolls. The video concludes with a close-up of the basket, which still contains many unopened penny rolls.",
    "spokenTranscript": "(no spoken dialogue)",
    "onScreenText": "(none)",
    "mathQuestion": "How many pennies are in the basket?",
    "studentNeed": "To solve this problem, students first need to identify the value of a single roll of pennies, which is labeled as 50 cents (or 50 pennies). They then need to estimate or determine the total number of rolls contained in the blue basket. By multiplying the number of pennies per roll by the total number of rolls, they can calculate the total number of pennies."
  },
  {
    "course": "algebra1",
    "topic": 10,
    "tag": "A1-T10",
    "title": "AGA24 A1 T10 MM3A ACT 1",
    "learningObjective": "Edgy Tiles",
    "videoUrl": "https://us-school.pk12ls.com/school/e5e2296e-e83e-4629-a747-cbb38605952c/A0836882/auth/asset/AVA618027.mp4",
    "durationSec": null,
    "premise": "A woman paints small wooden squares green and white and arranges them into a 3x3 grid on a small tile. She then moves to a much larger wooden board and begins placing the squares in the same pattern, suggesting she intends to cover the entire surface.",
    "spokenTranscript": "(no spoken dialogue)",
    "onScreenText": "(none)",
    "mathQuestion": "How many small squares will it take to cover the large wooden board?",
    "studentNeed": "Students must determine the dimensions of the individual small squares and the dimensions of the large wooden board. They will then use this information to calculate the total number of squares needed to completely cover the board's surface."
  },
  {
    "course": "algebra1",
    "topic": 11,
    "tag": "A1-T11",
    "title": "AGA24 A1 T11 MM3A ACT 1",
    "learningObjective": "Text Message",
    "videoUrl": "https://us-school.pk12ls.com/school/c22cee1a-f7c9-4d73-bc20-453aee398cb6/A0836952/auth/asset/AVA618030.mp4",
    "durationSec": null,
    "premise": "A young man sits on a couch and checks his smartphone. He scrolls through a long list of unread text messages, indicated by green dots, and expresses frustration at the high volume of incoming messages he's receiving.",
    "spokenTranscript": "Man, I’ve gotten so many texts today. I haven’t even been able to read all of them. At this rate, I have no idea how I’m going to keep up.",
    "onScreenText": "(none)",
    "mathQuestion": "How many unread text messages does he have?",
    "studentNeed": "Students need to determine the total number of unread messages based on the scrolling list shown in the video. They will need to estimate or count the number of messages visible on a single screen and then use the scrolling motion to calculate the total count of unread notifications."
  },
  {
    "course": "geometry",
    "topic": 1,
    "tag": "GM-T01",
    "title": "AGA24 GM T1 MM3A Act 1",
    "learningObjective": "Parallel Paving Company",
    "videoUrl": "https://us-school.pk12ls.com/school/72e0107a-f2fa-446e-a0bb-c4673dad88ed/A0837002/auth/asset/AVA618033.mp4",
    "durationSec": null,
    "premise": "The video displays a series of circular objects with repeating parts: a saw blade, a turbine, bicycle spokes, and a dartboard. As each object is shown, numbers appear to count the first few segments of the pattern, stopping before the full count is revealed.",
    "spokenTranscript": "(no spoken dialogue)",
    "onScreenText": "* 1, 2, 3, 4, 5\n* 1, 2, 3\n* 1, 2, 3\n* 1, 2, 3",
    "mathQuestion": "How many of each item are there in total?",
    "studentNeed": "Students need to determine the total number of repeating elements for each object shown: saw blade teeth, turbine blades, bicycle spokes, and dartboard sections. They will need to use strategies like counting a portion of the circle and multiplying, or measuring the central angle of one segment to find how many fit into 360 degrees."
  },
  {
    "course": "geometry",
    "topic": 2,
    "tag": "GM-T02",
    "title": "AGA24 GM T2 MM3A ACT 1",
    "learningObjective": "Parallel Paving Company",
    "videoUrl": "https://us-school.pk12ls.com/school/c4bff5fd-375b-4885-becb-d04727ddb9b5/A0837093/auth/asset/AVA618036.mp4",
    "durationSec": null,
    "premise": "A satellite view zooms into a rural field where three separate construction sites are identified. Time-lapse sequences show the daily progress of road segments being paved at Site 1 (over 5 days), Site 2 (over 4 days), and Site 3 (over 3 days).",
    "spokenTranscript": "[ ambient construction sounds ]",
    "onScreenText": "* Site 1\n* Site 2\n* Site 3\n* Day 1\n* Day 2\n* Day 3\n* Day 4\n* Day 5",
    "mathQuestion": "Which site will finish its road first?",
    "studentNeed": "Students need to determine the rate of construction at each site by measuring the length of the road segments added each day. They must then estimate the total intended length of each road and use the calculated rates to predict how many additional days are required for completion at each site."
  },
  {
    "course": "geometry",
    "topic": 3,
    "tag": "GM-T03",
    "title": "AGA24 GM T3 MM3A Act 1 Video with Questions",
    "learningObjective": "The Perplexing Polygon",
    "videoUrl": "https://us-school.pk12ls.com/school/b96d1dfb-1286-40eb-987e-dd96a93a1392/A0837151/auth/asset/AVA618039.mp4",
    "durationSec": null,
    "premise": "A woman presents a \"perplexing polygon\"—a 12-sided dodecagon—with a black arrow on the front and a red arrow on the back. She demonstrates that when the black arrow points up, the red arrow points left, and then shows how rotating the polygon changes the red arrow's orientation after a flip. The video ends with the black arrow pointing to the right, leaving the viewer to predict the direction of the red arrow on the reverse side.",
    "spokenTranscript": "May I show you my perplexing polygon? I drew a black arrow on the front side, pointing straight up and when I flip to the back side, the red arrow is pointing left. Let's see that one more time. Black arrow straight up on the front. Red arrow on the back is to the left. Pretty simple, right? Okay, we'll make one little change. I turn the polygon once. Draw in your mind where the red arrow will be when I flip the polygon. Visualize it. Ready? Woah. I'll show you that again. See, that's why it's called the perplexing polygon. Alright. What if we try it just one more time? I turn it two more times, and the black arrow is pointing to the right.",
    "onScreenText": "(none)",
    "mathQuestion": "Where will the red arrow point when the black arrow is pointing to the right?",
    "studentNeed": "Students need to model the relationship between the rotation of the dodecagon and the resulting orientation of the arrow on the back side after a flip. They must determine the angle of each \"turn\" (30 degrees for a 12-sided polygon) and how a reflection across the vertical axis affects the internal geometry. By identifying this pattern, they can predict the final position of the red arrow."
  },
  {
    "course": "geometry",
    "topic": 4,
    "tag": "GM-T04",
    "title": "AGA24 GM T4 MM3A ACT 1",
    "learningObjective": "Check It Out!",
    "videoUrl": "https://us-school.pk12ls.com/school/17fed2b7-1c1e-4117-914e-2181a2a2aa4b/A0837180/auth/asset/AVA618042.mp4",
    "durationSec": null,
    "premise": "Four students—Angela, Brian, Carlos, and Danielle—are shown in a split-screen video conference. A teacher instructs them to draw a triangle with sides of 5 inches and 7 inches and a 30-degree angle between them. The students then begin drawing their triangles on paper or tablets.",
    "spokenTranscript": ">> Teacher: Okay, check this out. I need you each to draw a triangle that has sides that are 5 inches and 7 inches, with 30 degees between them. [ music playing ]",
    "onScreenText": "* Angela\n* Brian\n* Carlos\n* Danielle",
    "mathQuestion": "Will all four students draw the same triangle?",
    "studentNeed": "Students need to determine if the Side-Angle-Side (SAS) criteria is sufficient to create a unique triangle. They will need to consider if different orientations or placements of the sides and angle could result in different shapes, or if the given constraints force a single, congruent result for everyone."
  },
  {
    "course": "geometry",
    "topic": 5,
    "tag": "GM-T05",
    "title": "AGA24 GM T5 MM3A Act 1",
    "learningObjective": "Making It Fair",
    "videoUrl": "https://us-school.pk12ls.com/school/54f9e360-1819-4de2-bf25-2522c45c008c/A0837247/auth/asset/AVA618045.mp4",
    "durationSec": null,
    "premise": "A county planner meets with three town representatives to discuss the location of a new helicopter ambulance pad. While the representatives from Carrollton and Riverside are happy with the current placement, the representative from Adamsville points out that his town is much further away. The planner concludes that they need to find a location that is fair for all three towns.",
    "spokenTranscript": ">> County planner: Hello, everybody, and thanks for agreeing to meet today. The representatives from Carrollton and Riverside are very pleased with the placement of the helicopter ambulance pad. However... [ beeping sounds ] >> County planner: ...the representative from Adamsville is not. Adamsville is too far from the helicopter ambulance pad. We need to make this fair for everybody.",
    "onScreenText": "(none)",
    "mathQuestion": "Where should the helicopter ambulance pad be located so that it is the same distance from all three towns?",
    "studentNeed": "Students need to determine the relative positions of the three towns—Carrollton, Riverside, and Adamsville—on a coordinate plane. They must then use geometric constructions or algebraic methods to find the circumcenter of the triangle formed by these towns, which represents the point equidistant from all three locations."
  },
  {
    "course": "geometry",
    "topic": 6,
    "tag": "GM-T06",
    "title": "AGA24 GM T6 MM3A ACT 1",
    "learningObjective": "The Mystery Sides",
    "videoUrl": "https://us-school.pk12ls.com/school/e8b2b309-8be3-484c-817f-618e95522be1/A0837296/auth/asset/AVA618048.mp4",
    "durationSec": null,
    "premise": "The video presents close-up views of four different objects: a coin, a cross-section of an okra pod, the base of a glass, and an open umbrella. Numbers appear on screen to begin counting the sides or segments of each object, but the video cuts away before the count is finished.",
    "spokenTranscript": "(no spoken dialogue)",
    "onScreenText": "* 1, 2, 3\n* 1, 2\n* 1, 2\n* 1, 2, 3",
    "mathQuestion": "How many sides does each object have?",
    "studentNeed": "Students need to determine the total number of sides for each of the four objects shown. They will need to look for patterns or symmetry in the partial views to predict the full shape and classify the resulting polygons."
  },
  {
    "course": "geometry",
    "topic": 7,
    "tag": "GM-T07",
    "title": "AGA24 GM T7 MM3A ACT 1",
    "learningObjective": "Make It Right",
    "videoUrl": "https://us-school.pk12ls.com/school/dfc2ac5a-c1b0-4d0b-b570-b87ca85759a4/A0837408/auth/asset/AVA618051.mp4",
    "durationSec": null,
    "premise": "A woman presents a town design to the Mayor, showing various landmarks like a high school and a library. The Mayor is disappointed by the small size of his own figure in the model, so the woman uses a remote to increase his height until he is satisfied.",
    "spokenTranscript": "Good morning! Oh! Good morning Mr. Mayor. Here is the new town design you requested. Mmm hmm. Here's the new high school, the innovative community center, the library, and the baseball diamond. And here's Rosco, the town mascot. Hmm... Why aren't I in the design? Oh, but you are, you're right here, next to the town hall. Mmm... No, that can't be right; I'm much taller than that. There, that's better.",
    "onScreenText": "(none)",
    "mathQuestion": "How tall is the Mayor's statue?",
    "studentNeed": "Students need to determine the final height of the Mayor's statue in the town model. They will need to identify a reference object (like the Town Hall or a car) to establish a scale and then calculate the statue's height based on the visual change shown in the video."
  },
  {
    "course": "geometry",
    "topic": 8,
    "tag": "GM-T08",
    "title": "AGA24 GM T8 MM3A ACT 1",
    "learningObjective": "The Impossible Measurement",
    "videoUrl": "https://us-school.pk12ls.com/school/1b38f6f5-cc85-45c7-b080-2db51b15e396/A0837463/auth/asset/AVA618054.mp4",
    "durationSec": null,
    "premise": "Two scientists in lab coats walk through a park using a tape measure to check the heights of various objects, including a park bench, a trash can, and a basketball hoop. They eventually stop at a very tall tree and realize their ladder is far too short to reach the top. The woman suggests using shadows and right triangles to determine the height of the tree.",
    "spokenTranscript": ">> Okay, but you still haven't mentioned why we're in this park. >> There are lots of reasons why you would need to measure objects. >> Right, like how many objects fit into a container or will a couch fit through a door. >> Both, good examples. But today, we're here in this park to measure specific height requirements. >> And what are those requirements? >> Specific height requirements. >> Ah...okay. >> Aha! It is exactly what it's supposed to be. >> Okay, so what's next? >> A garbage can! >> Um... >> Very good! Very observant. I knew it was here. So far, everything looks great. Another! You know, I could really use a... How did you know...? Got it! Aha! >> I don't think this is going to be tall enough. >> Perhaps you're correct. But it is sunny, so... >> So we could use right triangles and shadows to find its height. >> You're catching on! But in my opinion, I have a different idea.",
    "onScreenText": "(none)",
    "mathQuestion": "How tall is the tree?",
    "studentNeed": "Students need to determine the height of the tree using indirect measurement. They will need to apply the properties of similar right triangles, specifically by comparing the length of the tree's shadow to the length of the shadow cast by an object of a known height (such as one of the scientists or a meter stick)."
  },
  {
    "course": "geometry",
    "topic": 9,
    "tag": "GM-T09",
    "title": "AGA24 GM T9 MM3A ACT 1",
    "learningObjective": "You Be the Judge",
    "videoUrl": "https://us-school.pk12ls.com/school/e2f8dd3e-98c1-463d-822c-ba89cde36cea/A0837488/auth/asset/AVA618057.mp4",
    "durationSec": null,
    "premise": "Four students, Angela, Bruno, Carlos, and Danielle, appear in a split-screen video. A narrator instructs them to draw two points and then a third point exactly halfway between them. The students use markers to place colored dots on their screens as they attempt the task.",
    "spokenTranscript": ">> Draw two points and then a point that is exactly halfway between them. Ready? Begin. [ music ]",
    "onScreenText": "* Angela\n* Bruno\n* Carlos\n* Danielle",
    "mathQuestion": "\"Draw two points and then a point that is exactly halfway between them.\"",
    "studentNeed": "Students must determine which of the four students most accurately placed their third point at the midpoint of the first two. They will need to apply the midpoint formula or use measurement tools to verify the distances between the points drawn on the screen."
  },
  {
    "course": "geometry",
    "topic": 10,
    "tag": "GM-T10",
    "title": "AGA24 GM T10 MM3A ACT 1",
    "learningObjective": "Earth Watch",
    "videoUrl": "https://us-school.pk12ls.com/school/93514236-f4c9-4e5c-a6d6-edddec90cb09/A0837546/auth/asset/AVA618060.mp4",
    "durationSec": null,
    "premise": "A satellite is shown orbiting a planet, then the view zooms out to show Earth with two satellites in orbit. Each satellite projects a beam that covers a specific arc of the Earth's surface.",
    "spokenTranscript": "(no spoken dialogue)",
    "onScreenText": "(none)",
    "mathQuestion": "How many satellites are needed to cover the entire equator?",
    "studentNeed": "Students need to determine the measure of the arc covered by a single satellite's signal. They will need to use geometric principles involving circles, tangents, and central angles to calculate the portion of the Earth's circumference covered by one beam, then determine how many such satellites are required for 360-degree coverage."
  },
  {
    "course": "geometry",
    "topic": 11,
    "tag": "GM-T11",
    "title": "AGA24 GM T11 MM3A ACT 1",
    "learningObjective": "Box 'Em Up",
    "videoUrl": "https://us-school.pk12ls.com/school/0bab41af-fbf4-404d-b3a8-c5def200afb0/A0837608/auth/asset/AVA618063.mp4",
    "durationSec": null,
    "premise": "Orange candles are shown on a flat surface. Cardboard boxes fall from above, assemble themselves around the candles, and then arrange into a grid. A large shipping box appears, and the smaller candle boxes fly inside to fill it.",
    "spokenTranscript": "[ jazz guitar music ]",
    "onScreenText": "* CHLOE'S CANDLES\n* THIS END UP",
    "mathQuestion": "How many candle boxes will fit in the large shipping box?",
    "studentNeed": "Students need to determine the dimensions of the individual candle boxes and the larger shipping container. They will use this information to calculate the total capacity of the shipping box in terms of candle boxes. They may also need to account for the boxes remaining on the floor after the first shipping box is filled."
  },
  {
    "course": "geometry",
    "topic": 12,
    "tag": "GM-T12",
    "title": "AGA24 GM T12 MM3A ACT 1",
    "learningObjective": "Place Your Guess",
    "videoUrl": "https://us-school.pk12ls.com/school/3be7ba7d-9249-4d1c-aa3d-3024d1e3de58/A0837651/auth/asset/AVA618066.mp4",
    "durationSec": null,
    "premise": "A young woman and a young man sit at a table and challenge each other to a game of chance. The woman prepares to flip a handful of coins while the man prepares to roll two dice, and they perform several trials of tossing them simultaneously to see the results.",
    "spokenTranscript": ">> Okay, so are you ready for this? >> Oh, I'm ready for this. Are you? >> Of course I am, because I'm going to win. >> Uh, you're not going to win. I'm going to win. >> No, I'm going to win. >> Uh, no way. >> Okay, fine. So, then, let's just start. >> Alright. [ dice and coins rattling ]",
    "onScreenText": "* Score\n* 0\n* 0\n* Trial 1\n* Trial 2\n* Trial 3\n* Trial 4\n* 2\n* 5\n* 4\n* 1\n* 2\n* 3\n* (Quarter icons)",
    "mathQuestion": "Who is more likely to win?",
    "studentNeed": "Students need to determine the probability of each player's winning event to see who has the better chance of winning the game. They will need to define the sample space for rolling two dice and for flipping a set number of coins, then compare the theoretical probabilities of the specific outcomes that result in a win."
  },
  {
    "course": "algebra2",
    "topic": 1,
    "tag": "A2-T01",
    "title": "AGA24 A2 T1 MM3A ACT 1",
    "learningObjective": "Current Events",
    "videoUrl": "https://us-school.pk12ls.com/school/d5fe9523-511f-4172-8a57-84fcf09ebe6d/A0837760/auth/asset/AVA618069.mp4",
    "durationSec": null,
    "premise": "Three people are working on a woodworking project in a backyard using a circular saw, a belt sander, and a power drill. All three tools are connected to a single power strip that is plugged into a Kill A Watt meter to monitor electrical usage. The video shows the individuals plugging in their tools and using them in different combinations.",
    "spokenTranscript": "(no spoken dialogue)",
    "onScreenText": "* Kill A Watt®\n* 0.00\n* NATIONAL ELECTRICAL CONTRACTORS ASSOCIATION\n* SEED 77",
    "mathQuestion": "Will the circuit breaker trip if all three tools are used at the same time?",
    "studentNeed": "Students need to determine the electrical current, measured in amps, that each power tool draws while in operation. They will then need to calculate the total amperage used when the circular saw, belt sander, and drill are all running simultaneously and compare that sum to the maximum capacity of a standard household circuit breaker."
  },
  {
    "course": "algebra2",
    "topic": 2,
    "tag": "A2-T02",
    "title": "AGA24 A2 T2 MM3A Act 1",
    "learningObjective": "Swift Kick",
    "videoUrl": "https://us-school.pk12ls.com/school/34c9c714-5022-4b8e-b27e-b0af84dafb9b/A0837821/auth/asset/AVA618072.mp4",
    "durationSec": null,
    "premise": "A cartoon soccer player kicks five different colored balls toward a goal. For each shot, the video pauses to show the ball at three distinct points along its flight path.",
    "spokenTranscript": "(no spoken dialogue)",
    "onScreenText": "- -Press Start-\n- Shot 1\n- Shot 2\n- Shot 3\n- Shot 4\n- Shot 5",
    "mathQuestion": "Which shot will go into the goal?",
    "studentNeed": "Students need to determine the quadratic function that models the trajectory of each of the five shots. By using the three given points for each ball, they can calculate the path and predict whether it will pass through the opening of the soccer goal."
  },
  {
    "course": "algebra2",
    "topic": 3,
    "tag": "A2-T03",
    "title": "AGA24 A2 T3 MM3A Act 1",
    "learningObjective": "What Are the Rules?",
    "videoUrl": "https://us-school.pk12ls.com/school/72e57f88-14ac-45bc-b5dd-9c2213eefda9/A0837911/auth/asset/AVA618075.mp4",
    "durationSec": null,
    "premise": "A young man on a tennis court discovers a line of tennis balls numbered 3, 0, 1, -2, -3, -1, and 2. He attempts to serve several of them, with some landing in the court (accompanied by a \"ding\" sound) and others landing out (accompanied by a \"buzzer\" sound).",
    "spokenTranscript": "Who's been writing on these tennis balls? [ Buzzer sound ] [ Ding sound ] [ Buzzer sound ]",
    "onScreenText": "- 3\n- 0\n- 1\n- -2\n- -3\n- -1\n- 2",
    "mathQuestion": "Which of the remaining tennis balls will land in the court?",
    "studentNeed": "Students need to determine the relationship between the numbers on the balls and whether the serve is successful. By observing which numbers (2, 1, -3) resulted in hits or misses, they must identify the \"winning\" range of numbers. They will likely use a number line to model the situation and write an inequality to represent the successful serves."
  },
  {
    "course": "algebra2",
    "topic": 4,
    "tag": "A2-T04",
    "title": "AGA24 A2 T4 MM3A ACT 1",
    "learningObjective": "Real Cool Waters",
    "videoUrl": "https://us-school.pk12ls.com/school/8a486b05-814d-429d-b834-72c938389224/A0837991/auth/asset/AVA618078.mp4",
    "durationSec": null,
    "premise": "A boy fills an inflatable pool in his backyard using different hoses over three months. In June, he uses a standard hose; in July, he uses a high-powered hose; and in August, he uses both hoses simultaneously.",
    "spokenTranscript": "Let's go swimming! Turn on the hose! Turn off the hose! Finally. Thanks, Ms. Pavado! Let's see if you're as powerful as she says you are. Turn on the hose, please! Whoa. Turn off the hose! That was a lot quicker. This ought to do the trick. Turn on the hoses!",
    "onScreenText": "* June\n* 00:00 (timer)\n* July\n* August",
    "mathQuestion": "How long will it take to fill the pool using both hoses?",
    "studentNeed": "Students need to determine the rate at which each hose fills the pool individually based on the time taken in June and July. Then, they must calculate the combined rate of both hoses to predict the total time required to fill the pool in August."
  },
  {
    "course": "algebra2",
    "topic": 5,
    "tag": "A2-T05",
    "title": "AGA24 A2 T5 MM3A ACT 1",
    "learningObjective": "The Snack Shack",
    "videoUrl": "https://us-school.pk12ls.com/school/85b66908-9b47-4566-9bc3-13dc4d9198c8/A0838041/auth/asset/AVA618081.mp4",
    "durationSec": null,
    "premise": "Three friends at a beach need to reach a snack shack and disagree on the fastest route. They propose three different paths involving varying amounts of walking on sand versus walking on a wooden boardwalk.",
    "spokenTranscript": "So, we're hanging out at the beach, and after a long day, we were all starving. It was Logan's turn to choose where to eat, and he chose the Snack Shack. The only problem was we couldn't agree on the fastest way to get there. Logan wanted to take the most direct route, across the beach. [ Xylophone sounds ] But I know that we walk a lot faster on the boardwalk than we do on sand. So I thought we should walk straight to the boardwalk and then over to the Snack Shack. [ Xylophone sounds ] And neither of us could understand why Olivia wanted to walk the long way around. [ Xylophone sounds ] We didn't know anything about the distances in each direction, but there are evenly spaced posts along the boardwalk to help us estimate. [ Drum beat ] We got tired of arguing, so we split up, each determined to prove that our way was the fastest.",
    "onScreenText": "* North Beach Snack Shack",
    "mathQuestion": "Who will get to the Snack Shack first?",
    "studentNeed": "Students must use the visual cues of the boardwalk posts to estimate distances for the three proposed routes. They will then need to apply walking speeds for sand and boardwalk surfaces to calculate and compare the travel times for each path."
  },
  {
    "course": "algebra2",
    "topic": 6,
    "tag": "A2-T06",
    "title": "AGA24 A2 T6 MM3A ACT 1",
    "learningObjective": "The Crazy Conditioning",
    "videoUrl": "https://us-school.pk12ls.com/school/1fd554cd-46b5-475c-b140-7a37b5a4e7b8/A0838090/auth/asset/AVA618084.mp4",
    "durationSec": null,
    "premise": "A young man on a soccer field performs a series of shuttle run drills, increasing the number of back-and-forth sprints in each round. He starts with a full-length run, then adds a halfway marker in Round 2, and quarter-markers in Round 3, before challenging the viewer to calculate the distance for Round 20.",
    "spokenTranscript": "[ whistle blow ] >> Coach: That first round's the easy one. Round Two! Touch halfway, come back, and then full length and back. [ whistle blow ] >> Coach: We're just getting started. Catch your breath, and we'll go again. Round Three! Touch first quarter mark and back, halfway and back, three quarter mark and back, and then full length and back. [ whistle blow ] >> Coach: Okay, now you're getting a workout! Was that too easy for you? Okay, let's skip to round 20.",
    "onScreenText": "(none)",
    "mathQuestion": "How far will the coach run in Round 20?",
    "studentNeed": "Students need to identify the mathematical pattern governing the distance run in each round. They must determine how the number of shuttle runs and the fractional distances of those runs increase with each round (doubling the number of segments each time) to calculate the total distance for the 20th round."
  },
  {
    "course": "algebra2",
    "topic": 7,
    "tag": "A2-T07",
    "title": "AGA24 A2 T7 MM3A ACT 1",
    "learningObjective": "What Note Was That?",
    "videoUrl": "https://us-school.pk12ls.com/school/d2a8b030-7367-4718-9a55-1bbe6bb167b8/A0838196/auth/asset/AVA618087.mp4",
    "durationSec": null,
    "premise": "A young woman plays a melody on a flute in a music studio with a white piano in the background. After the melody, she holds a single, steady note, and a red sine wave graph appears on the screen, plotted against a coordinate plane with a marked horizontal axis.",
    "spokenTranscript": "(no spoken dialogue)",
    "onScreenText": "(none)",
    "mathQuestion": "What is the equation of the sine wave that models the sound of the flute?",
    "studentNeed": "Students need to analyze the visual representation of the sound wave to determine its mathematical properties. They must identify the amplitude, period, and any shifts from the origin based on the provided grid. Using these values, they will construct a trigonometric function that accurately describes the wave's motion over time."
  },
  {
    "course": "algebra2",
    "topic": 8,
    "tag": "A2-T08",
    "title": "AGA24 A2 T8 MM3A ACT 1",
    "learningObjective": "Ramp Up Your Design",
    "videoUrl": "https://us-school.pk12ls.com/school/7db4117c-42f8-4b8a-8fc6-9cf5190332cd/A0838233/auth/asset/AVA618090.mp4",
    "durationSec": null,
    "premise": "A woman in a wheelchair waits outside her home, which has a porch with two steps. Two construction workers arrive in a pickup truck carrying plywood and lumber. They greet the woman and prepare to build a wheelchair ramp for her front entrance.",
    "spokenTranscript": "(music under) >> Hi. We're here to build the ramp. >> Let's get started.",
    "onScreenText": "(none)",
    "mathQuestion": "How long should the ramp be?",
    "studentNeed": "Students need to determine the total height of the steps (the rise) and the appropriate slope for a wheelchair ramp. They will then use these measurements to calculate the necessary horizontal distance or the length of the ramp's surface."
  },
  {
    "course": "algebra2",
    "topic": 9,
    "tag": "A2-T09",
    "title": "AGA24 A2 T9 MM3A ACT 1",
    "learningObjective": "Watering the Lawn",
    "videoUrl": "https://us-school.pk12ls.com/school/cbeea0f8-6c0e-4c6e-ae01-c9f04ce6e2ad/A0838302/auth/asset/AVA618093.mp4",
    "durationSec": null,
    "premise": "A man in a straw hat pulls up to a house in a red pickup truck and retrieves three in-ground sprinkler heads from a tool bag. He looks out over a large, rectangular front lawn, considering how to install them.",
    "spokenTranscript": "Let's see the customer wants three in-ground sprinklers in his lawn.",
    "onScreenText": "(none)",
    "mathQuestion": "Where should the three sprinklers be placed to water the entire lawn?",
    "studentNeed": "Students need to determine the optimal placement for three circular watering patterns within a rectangular space. They will need to consider the dimensions of the lawn and the spray radius of the sprinklers to ensure full coverage with minimal waste or dry spots."
  },
  {
    "course": "algebra2",
    "topic": 10,
    "tag": "A2-T10",
    "title": "AGA24 A2 T10 MM3A ACT 1",
    "learningObjective": "The Big Burger",
    "videoUrl": "https://us-school.pk12ls.com/school/ca4cf0cf-c19e-4a43-83a1-440b19d58b94/A0838376/auth/asset/AVA618096.mp4",
    "durationSec": null,
    "premise": "A customer at a burger shop insists on ordering the \"biggest burger\" possible, despite the cashier's warnings that it might be too much to handle. He shows a photo on his phone of a massive burger with a tall stack of patties and cheese. The cashier eventually relents and places the order for \"one big burger\" over the shop's microphone.",
    "spokenTranscript": ">> Cashier: Have a nice day! >> Customer: Thank you! >> Customer: One big burger. >> Cashier: Are you sure? A lot of people think they want the big burger, but they can't handle the big burger. >> Customer: I don't think you understand. I want the biggest burger you can make. >> Cashier: But, I don't think you... >> Customer: Seriously. I saw this picture of a big burger you guys made last year. I want that. >> Cashier: You know, we have lot of other really delicious items on the menu. If you think you need a minute... >> Customer: I don't need a minute. One big burger, please. >> Cashier: Okay, don't say I didn't warn you. One big burger. >> Cashier: One big burger to go. Would you like a receipt? >> Customer: Yes. Totally worth it.",
    "onScreenText": "* Menu board (Cheese, Additional Toppings, Sides, Beverages)\n* Employee Time Sheet",
    "mathQuestion": "How many patties are in the big burger?",
    "studentNeed": "Students need to determine the total number of meat patties in the burger shown in the customer's photo. They will likely need to use visual estimation or proportional reasoning, comparing the height of a single patty or a small group of patties to the total height of the burger stack. In later acts, they may use information about the total height or weight of the burger to calculate the exact count."
  },
  {
    "course": "algebra2",
    "topic": 11,
    "tag": "A2-T11",
    "title": "AGA24 A2 T11 MM3A ACT 1",
    "learningObjective": "Mark and Recapture",
    "videoUrl": "https://us-school.pk12ls.com/school/802f660c-bba6-4af5-b551-6b33e9854a6a/A0838442/auth/asset/AVA618099.mp4",
    "durationSec": null,
    "premise": "A girl sees a donation request on her phone to save orangutans and decides to use her coin jar to contribute. She pours out a portion of the coins and begins counting them individually but quickly becomes frustrated. She realizes she needs a more efficient way to determine the total amount of money she has.",
    "spokenTranscript": "[ music ] [ message notification ] [ music ] >> Uh, start over! [ music ] Okay, I'm going to need a better method.",
    "onScreenText": "* DONATE NOW to save the Orangutans!\n* CLICK TO DONATE",
    "mathQuestion": "How much money is in the jar?",
    "studentNeed": "The student needs to determine the total value of the coins in the jar. They will need to identify the denominations of the coins and find a strategy for counting or estimating large quantities of money more efficiently than counting one by one."
  },
  {
    "course": "algebra2",
    "topic": 12,
    "tag": "A2-T12",
    "title": "AGA24 A2 T12 MM3A Act 1",
    "learningObjective": "Place Your Guess",
    "videoUrl": "https://us-school.pk12ls.com/school/8415035d-9789-4acc-a4ee-2ab21350f426/A0838467/auth/asset/AVA618066.mp4",
    "durationSec": null,
    "premise": "A young woman and a young man sit across from each other at a table, playfully arguing about who is going to win a game. The woman shakes four quarters in her hands while the man shakes two dice; they perform three trials where they toss the coins and roll the dice simultaneously. The video ends during the fourth trial, leaving the outcome of the game undecided.",
    "spokenTranscript": ">> Okay, so are you ready for this? \n>> Oh, I'm ready for this. Are you? \n>> Of course I am, because I'm going to win. \n>> Uh, you're not going to win. I'm going to win. \n>> No, I'm going to win. \n>> Uh, no way. \n>> Okay, fine. So, then, let's just start. \n>> Alright. \n[ dice and coins rattling ]",
    "onScreenText": "* Score 0 0\n* Trial 1\n* Trial 2\n* Trial 3\n* Trial 4\n* (Icons representing heads/tails of quarters)\n* (Numbers representing the values of the dice rolls)",
    "mathQuestion": "Is the game fair?",
    "studentNeed": "Students need to determine the probability of each player's winning condition to see if they have an equal chance of success. They must identify the sample space for flipping four coins (the woman's goal is to get four heads) and the sample space for rolling two dice (the man's goal is to roll a sum of 7). By calculating and comparing these two theoretical probabilities, students can conclude whether the game is mathematically fair."
  }
];

export function videoForChapter(course: CourseId, topic: number): EnvisionVideo | undefined {
  return ENVISION_VIDEOS.find((v) => v.course === course && v.topic === topic);
}
