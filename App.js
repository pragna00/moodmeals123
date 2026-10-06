import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
  Platform,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 40) : 0;


const EMOTION_EMOJIS = {
  Sad: '🥺',
  Stressed: '😫',
  Tired: '🥱',
  Happy: '😃',
  Anxious: '😰',
  Energetic: '⚡'
};

const FOODS = [
  // Sad 🥺
  {
    id: '1',
    title: 'Paneer Butter Masala with Naan',
    calories: 680,
    mealType: 'Dinner',
    emotion: 'Sad',
    category: 'High Protein',
    emoji: '🧀',
    bg: '#FEF3C7',
    desc: 'Rich cottage cheese in savory tomato-butter gravy with warm garlic naan.',
    benefits: 'Boosts serotonin with rich tryptophan and comforting carbs.',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: '2 Servings',
    ingredients: [
      '200g Fresh Paneer (cubed)',
      '3 Fresh Tomatoes (puréed)',
      '1 tbsp Ginger-Garlic Paste',
      '2 tbsp Butter & 1 tbsp Oil',
      '1/2 cup Heavy Cream',
      '1 tsp Garam Masala & Kasuri Methi',
      '2 Garlic Naans'
    ],
    instructions: [
      'Heat butter and oil in a pan. Add ginger-garlic paste and sauté for 1 minute until fragrant.',
      'Add tomato purée, turmeric, red chili powder, and salt. Cook until oil separates (8-10 mins).',
      'Stir in heavy cream, garam masala, and crushed kasuri methi on low heat.',
      'Add paneer cubes and simmer gently for 3-4 minutes to absorb flavors.',
      'Serve warm with garlic naan or steamed basmati rice.'
    ]
  },
  {
    id: '2',
    title: 'Gulab Jamun with Rabri',
    calories: 450,
    mealType: 'Dessert',
    emotion: 'Sad',
    category: 'Desserts',
    emoji: '🧆',
    bg: '#D1FAE5',
    desc: 'Soft milk dumplings soaked in cardamom rose syrup served with chilled Rabri.',
    benefits: 'Instant mood pick-me-up and satisfies sweet cravings.',
    prepTime: '20 mins',
    cookTime: '30 mins',
    servings: '3 Servings',
    ingredients: [
      '1 cup Milk Powder & 2 tbsp Maida',
      '1/4 tsp Baking Soda & 2 tbsp Ghee',
      '1.5 cups Sugar & 1.5 cups Water',
      '4 Cardamom pods & Rose water',
      '1 liter Whole Milk (for Rabri)',
      'Saffron strands & pistachios'
    ],
    instructions: [
      'Mix milk powder, maida, baking soda, and ghee. Add milk gradually to form a soft smooth dough.',
      'Shape into smooth round balls without cracks.',
      'Prepare sugar syrup by boiling sugar, water, cardamom, and rose water for 8 minutes.',
      'Deep fry dough balls in ghee/oil on low heat until golden brown, then submerge in warm syrup.',
      'Simmer whole milk for 25 mins until reduced to 1/3 volume for Rabri. Serve chilled over Gulab Jamun.'
    ]
  },
  {
    id: '3',
    title: 'Rajma Chawal',
    calories: 480,
    mealType: 'Lunch',
    emotion: 'Sad',
    category: 'Vegan',
    emoji: '🫘',
    bg: '#DBEAFE',
    desc: 'Red kidney bean curry cooked with aromatic spices served over steamed basmati rice.',
    benefits: 'High in magnesium and fiber, stabilizing blood sugar.',
    prepTime: '10 mins (+8 hrs soak)',
    cookTime: '35 mins',
    servings: '3 Servings',
    ingredients: [
      '1 cup Red Kidney Beans (Rajma)',
      '2 Onions & 2 Tomatoes (finely chopped)',
      '1 tbsp Ginger-Garlic paste',
      '1 tsp Cumin, Coriander & Rajma Masala',
      '1 cup Basmati Rice',
      'Fresh Coriander for garnish'
    ],
    instructions: [
      'Pressure cook soaked Rajma with salt and water for 5-6 whistles until melt-in-mouth tender.',
      'In a pot, sauté onions, ginger, and garlic in oil until golden brown.',
      'Add chopped tomatoes and spices. Cook until oil releases from the masala.',
      'Add cooked Rajma along with its broth. Simmer on low heat for 15-20 minutes to thicken.',
      'Serve piping hot over fragrant steamed Basmati rice.'
    ]
  },
  {
    id: '4',
    title: 'Gajar ka Halwa',
    calories: 380,
    mealType: 'Dessert',
    emotion: 'Sad',
    category: 'Desserts',
    emoji: '🥕',
    bg: '#FCE7F3',
    desc: 'Sweet carrot pudding cooked with milk, ghee, and roasted dry fruits.',
    benefits: 'Beta-carotene rich to lower oxidative stress.',
    prepTime: '15 mins',
    cookTime: '35 mins',
    servings: '4 Servings',
    ingredients: [
      '500g Fresh Red Carrots (grated)',
      '500ml Whole Milk',
      '1/2 cup Sugar or Jaggery',
      '3 tbsp Ghee',
      '1/4 cup Chopped Almonds & Cashews',
      '1/2 tsp Cardamom powder'
    ],
    instructions: [
      'Combine grated carrots and milk in a heavy-bottomed pan and cook on medium flame.',
      'Stir periodically until the milk evaporates completely (approx 20 mins).',
      'Add ghee and sugar. Stir continuously as sugar melts and halwa thickens.',
      'Sauté chopped nuts in ghee separately and mix into halwa with cardamom powder.',
      'Serve warm garnished with roasted nuts.'
    ]
  },
  {
    id: '5',
    title: 'Dal Makhani with Butter Roti',
    calories: 550,
    mealType: 'Dinner',
    emotion: 'Sad',
    category: 'Ayurvedic',
    emoji: '🍲',
    bg: '#EDE9FE',
    desc: 'Slow-cooked black lentils enriched with butter, cream, and Indian spices.',
    benefits: 'Hearty comfort food rich in plant proteins.',
    prepTime: '15 mins (+8 hrs soak)',
    cookTime: '40 mins',
    servings: '3 Servings',
    ingredients: [
      '1 cup Whole Black Gram (Urad Dal)',
      '1/4 cup Kidney Beans (Rajma)',
      '3 Tomatoes (puréed)',
      '2 tbsp Butter & 2 tbsp Heavy Cream',
      '1 tbsp Ginger-Garlic paste',
      '1 tsp Garam Masala & Kasuri Methi',
      'Hot Butter Rotis'
    ],
    instructions: [
      'Pressure cook soaked Urad dal and Rajma for 7-8 whistles until ultra tender and mashable.',
      'In a heavy pot, sauté ginger-garlic paste and tomato purée in butter until oil separates.',
      'Add cooked dal along with cooking water, salt, and garam masala.',
      'Simmer on very low heat for 30 minutes, mashing slightly with a spoon to make it velvety.',
      'Stir in heavy cream and fresh butter right before serving hot with butter rotis.'
    ]
  },
  {
    id: '6',
    title: 'Aloo Paratha with White Butter',
    calories: 440,
    mealType: 'Breakfast',
    emotion: 'Sad',
    category: 'Breakfast',
    emoji: '🥞',
    bg: '#FEE2E2',
    desc: 'Spiced potato-stuffed flatbread topped with white butter.',
    benefits: 'Carb-loading to fuel dopamine release on low-energy days.',
    prepTime: '15 mins',
    cookTime: '15 mins',
    servings: '2 Servings',
    ingredients: [
      '2 cups Whole Wheat Dough',
      '3 Boiled Potatoes (mashed)',
      '1 Green Chili & 1 tsp Cumin seeds',
      '1/2 tsp Garam Masala & Amchur powder',
      'Fresh Coriander (chopped)',
      'Fresh White Butter (Makhan)'
    ],
    instructions: [
      'Mix mashed potatoes with chopped green chili, cumin seeds, garam masala, amchur, and salt.',
      'Roll out a small dough ball into a 4-inch circle, place a big ball of potato stuffing in the center.',
      'Pinch edges together to seal, flatten, and roll out gently into a flatbread.',
      'Cook paratha on a hot skillet with ghee until golden brown spots appear on both sides.',
      'Serve sizzling hot topped with a massive dollop of white butter.'
    ]
  },

  // Stressed 😫
  {
    id: '9',
    title: 'Spinach & Garlic Dal with Ghee',
    calories: 420,
    mealType: 'Dinner',
    emotion: 'Stressed',
    category: 'Ayurvedic',
    emoji: '🥬',
    bg: '#E6F4EA',
    desc: 'Lentils simmered with fresh spinach, garlic, and tempered ghee.',
    benefits: 'Rich in Magnesium & Folate to lower cortisol & muscle tension.',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: '2 Servings',
    ingredients: [
      '1 cup Yellow Toor / Moong Dal',
      '2 cups Chopped Fresh Spinach',
      '6 Garlic cloves (sliced)',
      '1 tsp Cumin & Mustard seeds',
      '1 tbsp Ghee',
      '1 pinch Asafoetida (Hing)'
    ],
    instructions: [
      'Pressure cook dal with turmeric, salt, and water until soft.',
      'Heat ghee in a pan. Add cumin seeds, mustard seeds, sliced garlic, and hing.',
      'Add chopped spinach and sauté for 2 minutes until wilted.',
      'Pour cooked dal into the pan, mix well, and simmer for 5 minutes.',
      'Serve hot with brown rice or chapati.'
    ]
  },
  {
    id: '10',
    title: 'Dark Chocolate Avocado Mousse',
    calories: 310,
    mealType: 'Dessert',
    emotion: 'Stressed',
    category: 'Desserts',
    emoji: '🍫',
    bg: '#FCE7F3',
    desc: 'Rich raw cocoa whipped with ripe avocado and honey.',
    benefits: 'High in polyphenols & healthy fats to relieve acute stress.',
    prepTime: '10 mins',
    cookTime: '0 mins',
    servings: '2 Servings',
    ingredients: [
      '2 Ripe Avocados',
      '1/3 cup Unsweetened Dark Cocoa Powder',
      '1/4 cup Pure Honey or Maple Syrup',
      '1/4 cup Almond Milk',
      '1 tsp Vanilla extract',
      'Sea salt & cocoa nibs for topping'
    ],
    instructions: [
      'Scoop ripe avocado flesh into a high-speed blender or food processor.',
      'Add cocoa powder, honey, almond milk, and vanilla extract.',
      'Blend on high speed until silky smooth and creamy.',
      'Divide into dessert bowls and chill in the refrigerator for 20 minutes.',
      'Garnish with a pinch of sea salt and cocoa nibs before serving.'
    ]
  },
  {
    id: '11',
    title: 'Almond & Blueberry Oatmeal',
    calories: 360,
    mealType: 'Breakfast',
    emotion: 'Stressed',
    category: 'Breakfast',
    emoji: '🥣',
    bg: '#FEF3C7',
    desc: 'Rolled oats cooked in almond milk topped with fresh berries and almonds.',
    benefits: 'Slow-release complex carbs that stabilize mood & serotonin.',
    prepTime: '5 mins',
    cookTime: '8 mins',
    servings: '1 Serving',
    ingredients: [
      '1/2 cup Rolled Oats',
      '1 cup Unsweetened Almond Milk',
      '1/2 cup Fresh Blueberries',
      '2 tbsp Sliced Almonds',
      '1 tbsp Chia seeds',
      '1 tsp Honey'
    ],
    instructions: [
      'In a saucepan, bring almond milk and rolled oats to a gentle simmer.',
      'Cook for 5-7 minutes, stirring occasionally until thick and creamy.',
      'Remove from heat and stir in chia seeds.',
      'Transfer to a bowl and top with fresh blueberries, sliced almonds, and a drizzle of honey.'
    ]
  },
  {
    id: '12',
    title: 'Chamomile Lavender Green Tea',
    calories: 50,
    mealType: 'Beverages',
    emotion: 'Stressed',
    category: 'Beverages',
    emoji: '🍵',
    bg: '#DBEAFE',
    desc: 'Steeped organic chamomile, lavender blossoms, and green tea.',
    benefits: 'Calmative botanical herbs that soothe nervous system agitation.',
    prepTime: '3 mins',
    cookTime: '5 mins',
    servings: '1 Serving',
    ingredients: [
      '1 Chamomile Tea Bag',
      '1/2 tsp Dried Lavender Blossoms',
      '1 Organic Green Tea Bag',
      '2 cups Water',
      '1 tsp Raw Honey'
    ],
    instructions: [
      'Boil fresh water in a kettle and let cool slightly for 1 minute.',
      'Place chamomile, lavender, and green tea in a teapot or mug.',
      'Pour hot water over herbs and steep for 4-5 minutes.',
      'Strain tea into your favorite cup, stir in raw honey, and sip slowly.'
    ]
  },

  // Tired 🥱
  {
    id: '13',
    title: 'Banana Peanut Butter Smoothie',
    calories: 410,
    mealType: 'Beverages',
    emotion: 'Tired',
    category: 'High Protein',
    emoji: '🍌',
    bg: '#FEF3C7',
    desc: 'Blended ripe bananas, natural peanut butter, and Greek yogurt.',
    benefits: 'Rich in Potassium & B6 for an instant natural stamina surge.',
    prepTime: '5 mins',
    cookTime: '0 mins',
    servings: '1 Serving',
    ingredients: [
      '2 Ripe Bananas (frozen)',
      '2 tbsp Natural Peanut Butter',
      '1/2 cup Plain Greek Yogurt',
      '1 cup Whole Milk or Oat Milk',
      '1 tbsp Flaxseeds or Whey Protein'
    ],
    instructions: [
      'Place frozen banana slices, peanut butter, Greek yogurt, and milk into a blender.',
      'Blend at high speed for 60 seconds until completely smooth.',
      'Pour into a tall glass and dust with ground flaxseeds.'
    ]
  },
  {
    id: '14',
    title: 'Tender Coconut Protein Bowl',
    calories: 320,
    mealType: 'Breakfast',
    emotion: 'Tired',
    category: 'Breakfast',
    emoji: '🥥',
    bg: '#E0F2FE',
    desc: 'Fresh coconut water, coconut meat, chia seeds, and berries.',
    benefits: 'Replenishes vital electrolytes & combats mental sluggishness.',
    prepTime: '10 mins',
    cookTime: '0 mins',
    servings: '1 Serving',
    ingredients: [
      '1 Fresh Tender Coconut (water & soft meat)',
      '2 tbsp Chia Seeds',
      '1/2 cup Strawberries & Blueberries',
      '1 tbsp Pumpkin Seeds',
      '1 tbsp Honey'
    ],
    instructions: [
      'Scoop soft coconut meat and blend with 1/2 cup coconut water until creamy.',
      'Mix in chia seeds and let rest for 5 minutes to soak.',
      'Top bowl with fresh berries, pumpkin seeds, and remaining fresh coconut water.'
    ]
  },
  {
    id: '15',
    title: 'Sprouts & Pomegranate Salad',
    calories: 280,
    mealType: 'Snacks',
    emotion: 'Tired',
    category: 'Vegan',
    emoji: '🥗',
    bg: '#D1FAE5',
    desc: 'Moong sprouts tossed with pomegranate, lemon, and chaat masala.',
    benefits: 'High active bio-iron & Vitamin C to fight fatigue.',
    prepTime: '10 mins',
    cookTime: '0 mins',
    servings: '2 Servings',
    ingredients: [
      '1 cup Steamed Moong Sprouts',
      '1/2 cup Fresh Pomegranate Arils',
      '1 Cucumber (finely diced)',
      '1 tbsp Fresh Lemon Juice',
      '1/2 tsp Chaat Masala & Pink Salt'
    ],
    instructions: [
      'Combine moong sprouts, pomegranate seeds, and diced cucumber in a mixing bowl.',
      'Squeeze fresh lemon juice over the salad.',
      'Sprinkle chaat masala and pink salt. Toss gently and serve chilled.'
    ]
  },
  {
    id: '16',
    title: 'Egg Bhurji with Multigrain Toast',
    calories: 450,
    mealType: 'Breakfast',
    emotion: 'Tired',
    category: 'High Protein',
    emoji: '🍳',
    bg: '#FEE2E2',
    desc: 'Spiced Indian scrambled eggs served with warm toasted multigrain bread.',
    benefits: 'High choline & bioavailable protein to rebuild mental alertness.',
    prepTime: '8 mins',
    cookTime: '7 mins',
    servings: '1 Serving',
    ingredients: [
      '3 Fresh Farm Eggs',
      '1 Onion & 1 Tomato (finely chopped)',
      '1 Green Chili & fresh cilantro',
      '1/2 tsp Turmeric & Red Chili powder',
      '1 tbsp Butter',
      '2 Multigrain Toast slices'
    ],
    instructions: [
      'Melt butter in a pan. Sauté chopped onions, green chili, and tomatoes until soft.',
      'Crack eggs into a bowl, add turmeric, chili powder, and salt. Whisk lightly.',
      'Pour eggs into the pan and scramble continuously over medium heat for 3-4 minutes until fluffy.',
      'Garnish with fresh cilantro and serve immediately with toasted multigrain bread.'
    ]
  },

  // Happy 😃
  {
    id: '17',
    title: 'Mango Lassi Smoothie Bowl',
    calories: 350,
    mealType: 'Beverages',
    emotion: 'Happy',
    category: 'Beverages',
    emoji: '🥭',
    bg: '#FEF3C7',
    desc: 'Fresh Alphonso mango pulp blended with probiotic yogurt and cardamom.',
    benefits: 'Gut-friendly probiotics & natural sugars to sustain peak joyful energy.',
    prepTime: '5 mins',
    cookTime: '0 mins',
    servings: '1 Serving',
    ingredients: [
      '1 cup Fresh Alphonso Mango Pulp',
      '1 cup Chilled Greek Yogurt',
      '1/4 tsp Cardamom powder',
      '1 tbsp Pure Honey',
      'Saffron threads & sliced pistachios'
    ],
    instructions: [
      'Combine mango pulp, chilled yogurt, cardamom powder, and honey in a blender.',
      'Blend until velvety smooth and thick.',
      'Pour into a chilled bowl or glass.',
      'Top with sliced pistachios and saffron threads.'
    ]
  },
  {
    id: '18',
    title: 'Grilled Paneer Tikka Salad',
    calories: 430,
    mealType: 'Lunch',
    emotion: 'Happy',
    category: 'High Protein',
    emoji: '🥗',
    bg: '#E6F4EA',
    desc: 'Tandoori marinated paneer cubes grilled with bell peppers & fresh greens.',
    benefits: 'Sustained protein to fuel productive & happy social activities.',
    prepTime: '15 mins',
    cookTime: '12 mins',
    servings: '2 Servings',
    ingredients: [
      '200g Paneer (cubed)',
      '1/2 cup Thick Yogurt & 1 tbsp Tikka Masala',
      '1 Bell Pepper & 1 Red Onion (cubed)',
      'Mixed Salad Greens',
      'Lemon Juice & Chaat Masala'
    ],
    instructions: [
      'Marinate paneer, bell pepper, and onion cubes in tikka spiced yogurt for 15 minutes.',
      'Sear on a hot skillet with 1 tsp oil for 10-12 minutes until charred and fragrant.',
      'Toss grilled paneer & veggies over crisp salad greens.',
      'Drizzle lemon juice and sprinkle chaat masala.'
    ]
  },
  {
    id: '19',
    title: 'Fresh Berry Yogurt Parfait',
    calories: 290,
    mealType: 'Dessert',
    emotion: 'Happy',
    category: 'Desserts',
    emoji: '🍓',
    bg: '#FCE7F3',
    desc: 'Layered Greek yogurt, granola, fresh strawberries, and honey.',
    benefits: 'Antioxidants that protect brain health and enhance brain plasticity.',
    prepTime: '5 mins',
    cookTime: '0 mins',
    servings: '1 Serving',
    ingredients: [
      '1 cup Chilled Greek Yogurt',
      '1/2 cup Crunchy Granola',
      '1/2 cup Strawberries & Blueberries',
      '1 tbsp Raw Honey'
    ],
    instructions: [
      'Spoon half of the Greek yogurt into a glass parfait container.',
      'Add a layer of crunchy granola and fresh berry slices.',
      'Repeat with remaining yogurt and berries.',
      'Drizzle raw honey over top and serve immediately.'
    ]
  },

  // Anxious 😰
  {
    id: '20',
    title: 'Warm Turmeric Golden Milk',
    calories: 210,
    mealType: 'Beverages',
    emotion: 'Anxious',
    category: 'Ayurvedic',
    emoji: '🥛',
    bg: '#FEF3C7',
    desc: 'Warm milk infused with organic turmeric, black pepper, and saffron.',
    benefits: 'Curcumin reduces neuro-inflammation & eases nervous restlessness.',
    prepTime: '3 mins',
    cookTime: '5 mins',
    servings: '1 Serving',
    ingredients: [
      '1 cup Whole Milk or Oat Milk',
      '1/2 tsp Ground Organic Turmeric',
      '1 pinch Black Pepper & Cinnamon',
      '1 tsp Raw Honey',
      '2 Saffron threads'
    ],
    instructions: [
      'Heat milk in a small saucepan over medium-low heat.',
      'Whisk in turmeric, black pepper, cinnamon, and saffron.',
      'Simmer gently for 4-5 minutes (do not boil).',
      'Strain into a mug, stir in honey, and drink warm.'
    ]
  },
  {
    id: '21',
    title: 'Pumpkin Seed & Quinoa Bowl',
    calories: 390,
    mealType: 'Lunch',
    emotion: 'Anxious',
    category: 'Vegan',
    emoji: '🍲',
    bg: '#DBEAFE',
    desc: 'Steamed quinoa with roasted pumpkin seeds, sweet corn, and tahini.',
    benefits: 'Zinc & Tryptophan rich to calm racing thoughts and anxiety.',
    prepTime: '10 mins',
    cookTime: '15 mins',
    servings: '2 Servings',
    ingredients: [
      '1 cup Cooked Quinoa',
      '3 tbsp Roasted Pumpkin Seeds',
      '1/2 cup Steamed Sweet Corn',
      '1/2 Avocado (sliced)',
      '2 tbsp Tahini Lemon Dressing'
    ],
    instructions: [
      'Cook quinoa in salted water until fluffy.',
      'Assemble quinoa, sweet corn, sliced avocado, and roasted pumpkin seeds in a bowl.',
      'Drizzle with creamy tahini lemon dressing and toss gently.'
    ]
  },
  {
    id: '22',
    title: 'Oats Idli with Coconut Chutney',
    calories: 340,
    mealType: 'Breakfast',
    emotion: 'Anxious',
    category: 'Breakfast',
    emoji: '🫓',
    bg: '#D1FAE5',
    desc: 'Steamed oat flour & veggie idlis served with fresh coconut chutney.',
    benefits: 'Easy-to-digest soothing comfort food that settles stomach butterflies.',
    prepTime: '10 mins',
    cookTime: '12 mins',
    servings: '2 Servings',
    ingredients: [
      '1 cup Powdered Rolled Oats',
      '1/2 cup Curd (Yogurt) & 1/2 cup Water',
      '1/4 cup Grated Carrots & Green Peas',
      '1 tsp Mustard Seeds & Curry Leaves',
      'Fresh Coconut Chutney'
    ],
    instructions: [
      'Dry roast powdered oats for 2 minutes. Mix with curd, water, grated carrots, and salt to form batter.',
      'Heat 1 tsp oil, add mustard seeds and curry leaves until crackling, then stir into batter.',
      'Grease idli moulds, pour batter, and steam for 10-12 minutes until fluffy.',
      'Serve warm with fresh coconut chutney.'
    ]
  },

  // Energetic ⚡
  {
    id: '23',
    title: 'Quinoa Chickpea Power Bowl',
    calories: 460,
    mealType: 'Lunch',
    emotion: 'Energetic',
    category: 'High Protein',
    emoji: '🧆',
    bg: '#EDE9FE',
    desc: 'Spiced chickpeas, quinoa, avocado, and lime vinaigrette.',
    benefits: 'High fiber & plant protein to power through demanding workout sessions.',
    prepTime: '10 mins',
    cookTime: '15 mins',
    servings: '2 Servings',
    ingredients: [
      '1 cup Boiled Chickpeas',
      '1 cup Cooked Quinoa',
      '1/2 Cucumber & Cherry Tomatoes',
      '1/2 Avocado (cubed)',
      '2 tbsp Extra Virgin Olive Oil & Lime'
    ],
    instructions: [
      'Sauté chickpeas with cumin, paprika, garlic powder, and salt for 5 minutes.',
      'Layer fluffy quinoa, spiced chickpeas, diced cucumber, tomatoes, and avocado.',
      'Drizzle with olive oil and fresh lime juice.'
    ]
  },
  {
    id: '24',
    title: 'Roasted Makhana (Fox Nuts)',
    calories: 220,
    mealType: 'Snacks',
    emotion: 'Energetic',
    category: 'Snacks',
    emoji: '🍿',
    bg: '#FEF3C7',
    desc: 'Crunchy lotus seeds roasted in ghee with Himalayan pink salt.',
    benefits: 'Low-calorie crunchy snack packed with mineral energy.',
    prepTime: '2 mins',
    cookTime: '8 mins',
    servings: '2 Servings',
    ingredients: [
      '2 cups Phool Makhana (Fox Nuts)',
      '1 tbsp Pure Ghee',
      '1/2 tsp Himalayan Pink Salt',
      '1/4 tsp Roasted Cumin Powder & Black Pepper'
    ],
    instructions: [
      'Melt ghee in a wide pan over low flame.',
      'Add makhana and roast continuously for 7-8 minutes until crisp and crunchy.',
      'Sprinkle pink salt, pepper, and roasted cumin powder. Toss well and serve warm.'
    ]
  },
  {
    id: '25',
    title: 'Soya Chunk Masala Curry',
    calories: 490,
    mealType: 'Dinner',
    emotion: 'Energetic',
    category: 'High Protein',
    emoji: '🍲',
    bg: '#FEE2E2',
    desc: 'High-protein soya chunks cooked in onion-tomato & garam masala gravy.',
    benefits: 'Maximum plant protein to fuel peak muscle recovery & physical power.',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: '3 Servings',
    ingredients: [
      '1 cup Soya Chunks',
      '2 Onions & 2 Tomatoes (puréed)',
      '1 tbsp Ginger-Garlic paste',
      '1 tsp Garam Masala & Coriander powder',
      'Fresh Cilantro'
    ],
    instructions: [
      'Boil soya chunks in salted water for 5 minutes. Drain, rinse with cold water, and squeeze out excess water.',
      'Sauté onions, ginger, and garlic in 1 tbsp oil until golden brown.',
      'Add tomato purée and spices. Cook until oil releases from gravy.',
      'Add soya chunks and 1/2 cup water. Simmer on medium heat for 10 minutes.',
      'Garnish with fresh cilantro and serve with rotis or rice.'
    ]
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [selectedRecipeModal, setSelectedRecipeModal] = useState(null);

  const [activeTab, setActiveTab] = useState('Home');
  const [darkMode, setDarkMode] = useState(false);
  const [waterIntake, setWaterIntake] = useState(2500);
  const [reminderFreq, setReminderFreq] = useState('Every 30m');
  const [reminderActive, setReminderActive] = useState(true);
  const [baseUrl, setBaseUrl] = useState('http://10.0.2.2:5000/');
  const [selectedEmotion, setSelectedEmotion] = useState('Sad');
  const [intensity, setIntensity] = useState(85);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(['1', '3']);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'NutritionBot AI', text: "Namaste! 🙏 I'm your MoodMeals AI Nutritionist (powered by Live AI Gateway). Tell me how you're feeling, your schedule, or cravings, and I'll prescribe the perfect healthy meal!", isUser: false }
  ]);
  const [chatInput, setChatInput] = useState('');

  const themeBg = darkMode ? '#0F172A' : '#F8FAFC';
  const themeCard = darkMode ? '#1E293B' : '#FFFFFF';
  const themeText = darkMode ? '#F8FAFC' : '#0F172A';
  const themeSubtext = darkMode ? '#94A3B8' : '#64748B';

  const userDisplayName = currentUser?.email ? currentUser.email.split('@')[0] : 'sai';
  const userDisplayEmail = currentUser?.email || 'sai@1983';
  const userAvatarInitial = (userDisplayName[0] || 'S').toUpperCase();

  useEffect(() => {
    checkSessionAndSeedDb();
  }, []);

  // Automated Water Hydration Reminder Hook
  useEffect(() => {
    if (!reminderActive) return;

    let minutes = 30;
    if (reminderFreq === 'Every 30m') minutes = 30;
    else if (reminderFreq === 'Every 1h') minutes = 60;
    else if (reminderFreq === 'Every 2h') minutes = 120;
    else if (reminderFreq === 'Every 3h') minutes = 180;

    const intervalMs = minutes * 60 * 1000;
    const interval = setInterval(() => {
      Alert.alert(
        "💧 Water Hydration Reminder!",
        `It's time for your ${reminderFreq} water break! Drink 1 glass of water (250 ml) to stay hydrated and refreshed.`,
        [
          { text: "Drink +250ml 🥛", onPress: () => setWaterIntake(w => w + 250) },
          { text: "Dismiss", style: "cancel" }
        ]
      );
    }, intervalMs);

    return () => clearInterval(interval);
  }, [reminderActive, reminderFreq]);

  const checkSessionAndSeedDb = async () => {
    try {
      const existingUsersStr = await AsyncStorage.getItem('MOODMEALS_USERS_DB');
      if (!existingUsersStr) {
        const defaultUsers = [
          { email: 'sai@1983', password: 'password123', createdAt: new Date().toISOString() },
          { email: 'user@moodmeals.com', password: 'password123', createdAt: new Date().toISOString() }
        ];
        await AsyncStorage.setItem('MOODMEALS_USERS_DB', JSON.stringify(defaultUsers));
      }

      const activeSessionStr = await AsyncStorage.getItem('MOODMEALS_SESSION');
      if (activeSessionStr) {
        const sessionUser = JSON.parse(activeSessionStr);
        setCurrentUser(sessionUser);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) {
      console.error('Failed to load auth session:', e);
    }
  };

  const handleAuthSubmit = async () => {
    setAuthError('');
    setAuthSuccess('');

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanEmail) {
      setAuthError('Please enter your Email ID.');
      return;
    }
    if (!cleanEmail.includes('@') && !cleanEmail.includes('.')) {
      setAuthError('Please enter a valid Email ID (e.g. user@domain.com).');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setAuthError('Password must be at least 4 characters.');
      return;
    }

    try {
      const usersStr = await AsyncStorage.getItem('MOODMEALS_USERS_DB');
      const users = usersStr ? JSON.parse(usersStr) : [];

      if (authMode === 'signup') {
        const existingUser = users.find(u => u.email === cleanEmail);
        if (existingUser) {
          setAuthError('Account with this Email ID already exists! Please Log In.');
          return;
        }

        const newUser = { email: cleanEmail, password: cleanPassword, createdAt: new Date().toISOString() };
        users.push(newUser);
        await AsyncStorage.setItem('MOODMEALS_USERS_DB', JSON.stringify(users));
        await AsyncStorage.setItem('MOODMEALS_SESSION', JSON.stringify({ email: cleanEmail }));

        setCurrentUser({ email: cleanEmail });
        setIsLoggedIn(true);
        setEmailInput('');
        setPasswordInput('');
      } else {
        const targetUser = users.find(u => u.email === cleanEmail);
        if (!targetUser) {
          setAuthError('No account found with this Email ID. Please Sign Up first!');
          return;
        }

        if (targetUser.password !== cleanPassword) {
          setAuthError('Incorrect Password! Please check your credentials.');
          return;
        }

        await AsyncStorage.setItem('MOODMEALS_SESSION', JSON.stringify({ email: cleanEmail }));
        setCurrentUser({ email: cleanEmail });
        setIsLoggedIn(true);
        setEmailInput('');
        setPasswordInput('');
      }
    } catch (e) {
      setAuthError('Database operation failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('MOODMEALS_SESSION');
      setCurrentUser(null);
      setIsLoggedIn(false);
      setAuthError('');
      setAuthSuccess('');
    } catch (e) {
      setIsLoggedIn(false);
    }
  };

  const toggleFav = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSendChat = (textToSend) => {
    const msg = textToSend || chatInput;
    if (!msg.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: 'You', text: msg, isUser: true };
    
    let botReplyText = "Eating whole nutrient-dense foods tailored to your emotion maintains stable blood sugar and mood.";
    const q = msg.toLowerCase();
    if (q.includes('stress') || q.includes('relief')) {
      botReplyText = "For stress relief, eat Magnesium-rich Oatmeal with almonds, Spinach Khichdi, or Chamomile Green Tea!";
    } else if (q.includes('fatigue') || q.includes('tired')) {
      botReplyText = "When tired, choose high-protein choices like a Banana Protein Smoothie or Tender Coconut Water!";
    } else if (q.includes('indian')) {
      botReplyText = "Healthy Indian options: Rajma Chawal (high fiber), Dal Makhani with Roti, and Gajar ka Halwa with jaggery!";
    } else if (q.includes('today') || q.includes('eat')) {
      botReplyText = "Start your day with warm Aloo Paratha, Rajma Chawal for lunch, and Dal Makhani for dinner!";
    }

    const botMsg = { id: (Date.now() + 1).toString(), sender: 'NutritionBot AI', text: botReplyText, isUser: false };
    setChatMessages(prev => [...prev, userMsg, botMsg]);
    setChatInput('');
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeBg, paddingTop: STATUSBAR_HEIGHT, justifyContent: 'center', padding: 20 }]}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
        
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={[styles.cardBox, { backgroundColor: themeCard, padding: 24, borderRadius: 22, elevation: 4 }]}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 52 }}>💚</Text>
              <Text style={{ fontSize: 26, fontWeight: '800', color: themeText, marginTop: 8 }}>MoodMeals</Text>
              <Text style={{ color: themeSubtext, fontSize: 13, textAlign: 'center', marginTop: 4 }}>
                {authMode === 'login' ? 'Welcome back! Sign in to access your mood diet' : 'Create an account to track your mood & meals'}
              </Text>
            </View>

            {/* Auth Tab Mode Switcher */}
            <View style={{ flexDirection: 'row', backgroundColor: themeBg, borderRadius: 12, padding: 4, marginBottom: 20 }}>
              <TouchableOpacity
                onPress={() => { setAuthMode('login'); setAuthError(''); }}
                style={[{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 }, authMode === 'login' && { backgroundColor: '#10B981' }]}
              >
                <Text style={{ fontWeight: '700', color: authMode === 'login' ? '#fff' : themeSubtext, fontSize: 14 }}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setAuthMode('signup'); setAuthError(''); }}
                style={[{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 }, authMode === 'signup' && { backgroundColor: '#10B981' }]}
              >
                <Text style={{ fontWeight: '700', color: authMode === 'signup' ? '#fff' : themeSubtext, fontSize: 14 }}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {authError ? (
              <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 10, marginBottom: 16 }}>
                <Text style={{ color: '#DC2626', fontSize: 12, fontWeight: '600', textAlign: 'center' }}>⚠️ {authError}</Text>
              </View>
            ) : null}

            <Text style={{ fontWeight: '700', color: themeText, marginBottom: 6 }}>Email ID</Text>
            <TextInput
              style={[styles.searchInput, { backgroundColor: themeBg, color: themeText, marginBottom: 14 }]}
              placeholder="e.g. user@gmail.com or sai@1983"
              placeholderTextColor={themeSubtext}
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailInput}
              onChangeText={setEmailInput}
            />

            <Text style={{ fontWeight: '700', color: themeText, marginBottom: 6 }}>Password</Text>
            <TextInput
              style={[styles.searchInput, { backgroundColor: themeBg, color: themeText, marginBottom: 20 }]}
              placeholder="••••••••"
              placeholderTextColor={themeSubtext}
              secureTextEntry
              value={passwordInput}
              onChangeText={setPasswordInput}
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleAuthSubmit}>
              <Text style={styles.primaryBtnText}>{authMode === 'login' ? 'Log In to Database ➔' : 'Create Account in Database ➔'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 16, alignItems: 'center' }}
              onPress={() => {
                setEmailInput('sai@1983');
                setPasswordInput('password123');
              }}
            >
              <Text style={{ color: '#0EA5E9', fontSize: 12, fontWeight: '600' }}>⚡ Autofill Demo Account (sai@1983)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeBg, paddingTop: STATUSBAR_HEIGHT }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />



      {/* Top Header matching screenshots */}
      <View style={[styles.headerBar, { backgroundColor: themeCard }]}>
        <View style={styles.topLogoRow}>
          <View style={styles.logoGroup}>
            <Text style={{ fontSize: 20 }}>💚</Text>
            <Text style={[styles.logoText, { color: themeText }]}>MoodMeals</Text>
          </View>
          <TouchableOpacity style={styles.notifBadge}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
            <View style={styles.badgeDot}><Text style={styles.badgeText}>2</Text></View>
          </TouchableOpacity>
        </View>

        {/* Top Scrollable Tab Chips matching screenshots */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topTabScroll}>
          {['Home', 'Mood', 'Meals', 'Water', 'Chat', 'History', 'Settings'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.topTabChip, isActive && styles.topTabChipActive]}
              >
                <Text style={[styles.topTabText, { color: isActive ? '#10B981' : themeSubtext }, isActive && { fontWeight: '700' }]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Body Content based on activeTab */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {activeTab === 'Home' && (
          <View>
            <View style={styles.welcomeRow}>
              <View>
                <Text style={[styles.welcomeTitle, { color: themeText }]}>Welcome back, {userDisplayName} 👋</Text>
                <Text style={{ color: themeSubtext, fontSize: 13 }}>How are you feeling today?</Text>
              </View>
              <View style={styles.avatarCircle}><Text style={styles.avatarText}>{userAvatarInitial}</Text></View>
            </View>

            {/* Quick Mood Selection Banner */}
            <View style={styles.bannerCard}>
              <Text style={styles.bannerTitle}>Mood Selection 😃</Text>
              <Text style={styles.bannerSub}>Select your emotion & intensity level to get tailored meal recommendations.</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setActiveTab('Mood')}>
                <Text style={styles.primaryBtnText}>Log Mood Now  ➔</Text>
              </TouchableOpacity>
            </View>

            {/* Water Tracker Mini Widget */}
            <TouchableOpacity style={styles.waterWidget} onPress={() => setActiveTab('Water')}>
              <Text style={{ fontSize: 32 }}>💧</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: '700', color: '#0EA5E9', fontSize: 15 }}>Water & Hydration 💧</Text>
                <Text style={{ color: '#0369A1', fontSize: 12 }}>2,500 ml / 2,500 ml (100% completed)</Text>
              </View>
              <Text style={{ fontWeight: '700', color: '#0EA5E9' }}>10/10 🥤</Text>
            </TouchableOpacity>

            {/* Recommended Meals Carousel */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: themeText }]}>Recommended for {selectedEmotion} {EMOTION_EMOJIS[selectedEmotion]} 🍲</Text>
              <TouchableOpacity onPress={() => setActiveTab('Meals')}>
                <Text style={{ color: '#10B981', fontWeight: '600' }}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {(FOODS.filter(f => f.emotion === selectedEmotion).length > 0
                ? FOODS.filter(f => f.emotion === selectedEmotion)
                : FOODS.slice(0, 4)
              ).map((food) => (
                <TouchableOpacity key={food.id} onPress={() => setSelectedRecipeModal(food)} style={[styles.carouselCard, { backgroundColor: themeCard }]}>
                  <View style={[styles.foodEmojiContainer, { backgroundColor: food.bg }]}>
                    <Text style={{ fontSize: 36 }}>{food.emoji}</Text>
                  </View>
                  <Text numberOfLines={1} style={[styles.foodTitle, { color: themeText }]}>{food.title}</Text>
                  <Text style={{ color: '#10B981', fontSize: 12, marginTop: 4, fontWeight: '600' }}>
                    {food.calories} kcal • {food.mealType}
                  </Text>
                  <Text style={{ color: '#0EA5E9', fontSize: 10, marginTop: 2, fontWeight: '700' }}>📖 View Recipe ➔</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'Mood' && (
          <View>
            <Text style={[styles.screenTitle, { color: themeText }]}>Mood Selection & Analysis 🎭</Text>
            <Text style={{ color: themeSubtext, fontSize: 13, marginBottom: 16 }}>Select your current emotion to get instant nutritional meal prescriptions.</Text>

            <View style={styles.emotionGrid}>
              {[
                { name: 'Sad', emoji: '🥺' },
                { name: 'Stressed', emoji: '😫' },
                { name: 'Tired', emoji: '🥱' },
                { name: 'Happy', emoji: '😃' },
                { name: 'Anxious', emoji: '😰' },
                { name: 'Energetic', emoji: '⚡' }
              ].map((item) => {
                const isSelected = selectedEmotion === item.name;
                return (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => setSelectedEmotion(item.name)}
                    style={[styles.emotionCard, { backgroundColor: isSelected ? '#E6F4EA' : themeCard, borderColor: isSelected ? '#10B981' : 'transparent' }]}
                  >
                    <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
                    <Text style={{ color: themeText, fontWeight: isSelected ? '700' : '500', marginTop: 4, fontSize: 13 }}>{item.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Dynamic Analysis Banner & Prescribed Meals List */}
            <View style={[styles.bannerCard, { marginTop: 20, backgroundColor: '#E6F4EA' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', color: '#10B981', fontSize: 16 }}>
                  {EMOTION_EMOJIS[selectedEmotion]} Prescribed Meals for {selectedEmotion}
                </Text>
                <TouchableOpacity onPress={() => setActiveTab('Meals')}>
                  <Text style={{ color: '#059669', fontSize: 12, fontWeight: '700' }}>View All Meals ➔</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ color: '#065F46', fontSize: 13, marginTop: 4, fontWeight: '600' }}>
                Nutritional Intelligence Prescriptions:
              </Text>
            </View>

            {/* Prescribed Food Cards for Selected Emotion */}
            <View style={{ marginTop: 10 }}>
              {FOODS.filter(f => f.emotion === selectedEmotion).map((food) => (
                <TouchableOpacity key={food.id} onPress={() => setSelectedRecipeModal(food)} style={[styles.cardBox, { backgroundColor: themeCard, marginBottom: 12, flexDirection: 'row', alignItems: 'center', padding: 12 }]}>
                  <View style={[styles.foodEmojiContainer, { backgroundColor: food.bg, width: 68, height: 68, borderRadius: 14 }]}>
                    <Text style={{ fontSize: 32 }}>{food.emoji}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.foodTitle, { color: themeText, fontSize: 14, fontWeight: '700' }]}>{food.title}</Text>
                    <Text style={{ color: '#10B981', fontSize: 12, fontWeight: '700', marginTop: 2 }}>
                      {food.calories} kcal • {food.mealType}
                    </Text>
                    <Text style={{ color: themeSubtext, fontSize: 11, marginTop: 4 }}>
                      💡 {food.benefits}
                    </Text>
                    <Text style={{ color: '#0EA5E9', fontSize: 11, fontWeight: '700', marginTop: 4 }}>👨‍🍳 Tap to view preparation recipe & process ➔</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'Meals' && (
          <View>
            <TextInput
              style={[styles.searchInput, { backgroundColor: themeCard, color: themeText }]}
              placeholder="Search foods, recipes, benefits..."
              placeholderTextColor={themeSubtext}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* Screenshot #5 AI Banner */}
            <View style={styles.aiBadgeBanner}>
              <Text style={{ fontSize: 13, color: themeText }}>Showing meals for: <Text style={{ color: '#10B981', fontWeight: '700' }}>{selectedEmotion} {EMOTION_EMOJIS[selectedEmotion]}</Text></Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity style={styles.pillBtnGreen}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>✨ Refresh AI Meals</Text></TouchableOpacity>
                <TouchableOpacity style={styles.pillBtnOutline}><Text style={{ color: '#10B981', fontSize: 11 }}>Show All</Text></TouchableOpacity>
              </View>
            </View>

            {/* Category Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
              {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts', 'High Protein', 'Vegan'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
                >
                  <Text style={{ color: selectedCategory === cat ? '#fff' : themeText, fontSize: 12 }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* 2-Column Food Grid matching Screenshot #5 */}
            <View style={styles.foodGrid}>
              {FOODS.filter(f => (f.emotion === selectedEmotion || selectedEmotion === 'All') && (selectedCategory === 'All' || f.mealType === selectedCategory || f.category === selectedCategory)).map(food => {
                const isFav = favorites.includes(food.id);
                return (
                  <TouchableOpacity key={food.id} onPress={() => setSelectedRecipeModal(food)} style={[styles.gridCard, { backgroundColor: themeCard }]}>
                    <View style={[styles.gridEmojiBox, { backgroundColor: food.bg }]}>
                      <Text style={{ fontSize: 40 }}>{food.emoji}</Text>
                      <TouchableOpacity onPress={() => toggleFav(food.id)} style={styles.favBtn}>
                        <Text style={{ fontSize: 14 }}>{isFav ? '❤️' : '🤍'}</Text>
                      </TouchableOpacity>
                    </View>
                    <Text numberOfLines={2} style={[styles.gridFoodTitle, { color: themeText }]}>{food.title}</Text>
                    <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '600', marginTop: 4 }}>
                      ○ {food.calories} kcal • {food.mealType}
                    </Text>
                    <Text style={{ color: '#0EA5E9', fontSize: 10, fontWeight: '700', marginTop: 4 }}>📖 Recipe ➔</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {activeTab === 'Water' && (
          <View>
            <Text style={[styles.screenTitle, { color: themeText }]}>Water & Hydration</Text>
            <Text style={{ color: themeSubtext, fontSize: 13, marginBottom: 16 }}>Track your daily water intake & get smart reminders</Text>

            {/* Hero Blue Card matching Screenshot #4 */}
            <View style={styles.blueHeroCard}>
              <View style={styles.blueCircleProgress}>
                <Text style={{ fontSize: 24 }}>💧</Text>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{waterIntake.toLocaleString()} ml</Text>
                <Text style={{ color: '#E0F2FE', fontSize: 11 }}>100% of daily goal</Text>
              </View>
              <View style={styles.targetBadge}><Text style={{ color: '#fff', fontSize: 12 }}>Target: 2,500 ml (10 glasses)</Text></View>
              <Text style={{ color: '#fff', textAlign: 'center', fontSize: 12, marginTop: 12 }}>
                🎉 Outstanding! You reached your daily hydration goal! Your body & mind are fully fueled.
              </Text>
            </View>

            {/* Quick Log Water Section */}
            <Text style={[styles.sectionTitle, { color: themeText, marginTop: 20 }]}>Quick Log Water</Text>
            <View style={styles.quickWaterRow}>
              <TouchableOpacity onPress={() => setWaterIntake(w => w + 250)} style={[styles.waterPill, { backgroundColor: themeCard }]}>
                <Text style={{ fontSize: 20 }}>🥛</Text><Text style={{ fontWeight: '700', fontSize: 12 }}>+ 1 Glass</Text><Text style={{ color: themeSubtext, fontSize: 10 }}>250 ml</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setWaterIntake(w => w + 500)} style={[styles.waterPill, { backgroundColor: themeCard }]}>
                <Text style={{ fontSize: 20 }}>💧</Text><Text style={{ fontWeight: '700', fontSize: 12 }}>+ 1 Bottle</Text><Text style={{ color: themeSubtext, fontSize: 10 }}>500 ml</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setWaterIntake(w => w + 750)} style={[styles.waterPill, { backgroundColor: themeCard }]}>
                <Text style={{ fontSize: 20 }}>🪣</Text><Text style={{ fontWeight: '700', fontSize: 12 }}>+ Large</Text><Text style={{ color: themeSubtext, fontSize: 10 }}>750 ml</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setWaterIntake(w => Math.max(0, w - 250))} style={[styles.waterPill, { backgroundColor: themeCard }]}>
                <Text style={{ fontSize: 20 }}>↩️</Text><Text style={{ fontWeight: '700', fontSize: 12, color: 'red' }}>Undo</Text><Text style={{ color: 'red', fontSize: 10 }}>-250 ml</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.glassesCounterRow}>
              <Text style={{ fontWeight: '700', color: themeText }}>Today's Glasses</Text>
              <Text style={{ fontWeight: '700', color: '#0EA5E9' }}>{Math.floor(waterIntake / 250)} / 10 glasses</Text>
            </View>

            {/* Smart Water Reminder Card in Water Tab */}
            <View style={[styles.waterSettingCard, { marginTop: 16, backgroundColor: themeCard }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 24 }}>⏰</Text>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: '700', color: themeText, fontSize: 14 }}>30-Min Water Reminder</Text>
                    <Text style={{ color: reminderActive ? '#10B981' : themeSubtext, fontSize: 11, fontWeight: '600', marginTop: 2 }}>
                      {reminderActive ? `Status: Active (${reminderFreq})` : 'Status: Off'}
                    </Text>
                  </View>
                </View>
                <Switch value={reminderActive} onValueChange={setReminderActive} trackColor={{ true: '#0EA5E9' }} />
              </View>

              <Text style={{ color: themeSubtext, fontSize: 12, marginTop: 10 }}>Select Reminder Frequency:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {['Every 30m', 'Every 1h', 'Every 2h', 'Every 3h'].map(f => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => {
                      setReminderFreq(f);
                      setReminderActive(true);
                      Alert.alert("Water Reminder Set ⏱️", `You will now receive a hydration alert ${f.toLowerCase()}!`);
                    }}
                    style={[styles.freqChip, reminderFreq === f && { backgroundColor: '#0EA5E9' }]}
                  >
                    <Text style={{ color: reminderFreq === f ? '#fff' : themeText, fontSize: 11, fontWeight: '600' }}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <TouchableOpacity
                  onPress={() => setWaterIntake(w => w + 250)}
                  style={[styles.blueBtn, { flex: 1, justifyContent: 'center' }]}
                >
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>+250ml Drink Water 💧</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Alert.alert(
                    "💧 30-Min Water Reminder Test",
                    `Time for your 30-minute water break! Drink 1 glass of water (250 ml) to stay hydrated and focused.`,
                    [
                      { text: "Drink +250ml 🥛", onPress: () => setWaterIntake(w => w + 250) },
                      { text: "Dismiss", style: "cancel" }
                    ]
                  )}
                  style={[styles.outlineBlueBtn, { flex: 1, justifyContent: 'center' }]}
                >
                  <Text style={{ color: '#0EA5E9', fontSize: 12, fontWeight: '700' }}>🔔 Test 30m Alert</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Chat' && (
          <View style={{ height: 500 }}>
            {/* Bot Header matching Screenshot #3 */}
            <View style={[styles.botHeaderCard, { backgroundColor: themeCard }]}>
              <View style={styles.botAvatarCircle}><Text style={{ fontSize: 20 }}>🤖</Text></View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: '700', color: themeText, fontSize: 15 }}>NutritionBot AI</Text>
                <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '600' }}>• Online & Ready to help</Text>
              </View>
            </View>

            <ScrollView style={{ flex: 1, marginVertical: 10 }}>
              {chatMessages.map(msg => (
                <View key={msg.id} style={[styles.chatBubble, msg.isUser ? styles.userBubble : [styles.botBubble, { backgroundColor: themeCard }]]}>
                  <Text style={{ color: msg.isUser ? '#fff' : themeText, fontSize: 13 }}>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Quick Suggestion Pills matching Screenshot #3 */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 40, marginBottom: 8 }}>
              {["What should I eat today?", "Healthy Indian foods", "Stress relief foods", "Best for fatigue"].map(q => (
                <TouchableOpacity key={q} onPress={() => handleSendChat(q)} style={[styles.chatPill, { backgroundColor: themeCard }]}>
                  <Text style={{ color: themeText, fontSize: 11 }}>{q}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.chatInput, { backgroundColor: themeCard, color: themeText }]}
                placeholder="Ask about foods, mood, diet..."
                placeholderTextColor={themeSubtext}
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={() => handleSendChat()}>
                <Text style={{ color: '#fff', fontSize: 16 }}>➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'History' && (
          <View>
            <Text style={[styles.screenTitle, { color: themeText }]}>Mood History</Text>
            <Text style={{ color: themeSubtext, fontSize: 13, marginBottom: 16 }}>Track your emotional patterns over time</Text>

            {/* Weekly Bar Chart matching Screenshot #2 */}
            <View style={[styles.cardBox, { backgroundColor: themeCard }]}>
              <Text style={{ fontWeight: '700', color: themeText, fontSize: 14, marginBottom: 14 }}>Weekly Mood Distribution</Text>
              <View style={styles.barChartRow}>
                {[
                  { day: 'Mon', count: 2 },
                  { day: 'Tue', count: 1 },
                  { day: 'Wed', count: 3 },
                  { day: 'Thu', count: 2 },
                  { day: 'Fri', count: 4 },
                  { day: 'Sat', count: 3 }
                ].map(item => (
                  <View key={item.day} style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: themeSubtext }}>{item.count}</Text>
                    <View style={[styles.barCol, { height: item.count * 20 }]} />
                    <Text style={{ fontSize: 11, color: themeText, marginTop: 4 }}>{item.day}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Mood Frequency Section matching Screenshot #2 */}
            <View style={[styles.cardBox, { backgroundColor: themeCard, marginTop: 14 }]}>
              <Text style={{ fontWeight: '700', color: themeText, fontSize: 14, marginBottom: 10 }}>Mood Frequency</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ alignItems: 'center' }}><Text>🥺 Sad</Text><Text style={{ color: '#10B981', fontWeight: '700' }}>40%</Text></View>
                <View style={{ alignItems: 'center' }}><Text>😫 Stressed</Text><Text style={{ color: '#0EA5E9', fontWeight: '700' }}>25%</Text></View>
                <View style={{ alignItems: 'center' }}><Text>🥱 Tired</Text><Text style={{ color: '#F59E0B', fontWeight: '700' }}>20%</Text></View>
                <View style={{ alignItems: 'center' }}><Text>😃 Happy</Text><Text style={{ color: '#10B981', fontWeight: '700' }}>15%</Text></View>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Settings' && (
          <View>
            <Text style={[styles.screenTitle, { color: themeText }]}>Settings & Preferences</Text>

            {/* User Profile Card matching Screenshot #1 */}
            <View style={[styles.userCard, { backgroundColor: themeCard }]}>
              <View style={styles.userAvatar}><Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{userAvatarInitial}</Text></View>
              <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                  <Text style={{ fontWeight: '700', color: themeText, fontSize: 15 }}>{userDisplayName}</Text>
                  <View style={styles.hydratedBadge}><Text style={{ color: '#10B981', fontSize: 10, fontWeight: '700' }}>💧 100% Hydrated</Text></View>
                </View>
                <Text style={{ color: themeSubtext, fontSize: 11, marginTop: 2 }}>{userDisplayEmail}</Text>
              </View>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutPillBtn}>
                <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 12 }}>Logout 🚪</Text>
              </TouchableOpacity>
            </View>

            {/* Water Hydration Card matching Screenshot #1 */}
            <View style={styles.waterSettingCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 22 }}>💧</Text>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontWeight: '700', fontSize: 14 }}>Water Hydration & Smart Reminders</Text>
                    <Text style={{ color: '#0EA5E9', fontSize: 11 }}>Daily Intake: 2,500 / 2,500 ml</Text>
                  </View>
                </View>
                <Switch value={reminderActive} onValueChange={setReminderActive} trackColor={{ true: '#0EA5E9' }} />
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {['Every 30m', 'Every 1h', 'Every 2h', 'Every 3h'].map(f => (
                  <TouchableOpacity key={f} onPress={() => setReminderFreq(f)} style={[styles.freqChip, reminderFreq === f && { backgroundColor: '#0EA5E9' }]}>
                    <Text style={{ color: reminderFreq === f ? '#fff' : '#000', fontSize: 11, fontWeight: '600' }}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
                <TouchableOpacity onPress={() => setWaterIntake(w => w + 260)} style={styles.blueBtn}><Text style={{ color: '#fff', fontSize: 11 }}>+260ml Drink Water 💧</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("🔔 Reminder Test", "Drink a glass of water now!")} style={styles.outlineBlueBtn}><Text style={{ color: '#0EA5E9', fontSize: 11 }}>🔔 Test Reminder</Text></TouchableOpacity>
              </View>
            </View>

            {/* Dark Mode Switch */}
            <View style={[styles.userCard, { backgroundColor: themeCard, marginTop: 12 }]}>
              <Text style={{ fontWeight: '700', color: themeText, fontSize: 14 }}>Dark Theme Mode</Text>
              <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: '#10B981' }} />
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.fullLogoutBtn} onPress={handleLogout}>
              <Text style={styles.fullLogoutBtnText}>Log Out of Account 🚪</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNavBar, { backgroundColor: themeCard }]}>
        {[
          { key: 'Home', icon: '🏠' },
          { key: 'Mood', icon: '😃' },
          { key: 'Meals', icon: '🍲' },
          { key: 'Water', icon: '💧' },
          { key: 'Chat', icon: '💬' },
          { key: 'History', icon: '📊' },
          { key: 'Settings', icon: '⚙️' }
        ].map(item => {
          const isActive = activeTab === item.key;
          return (
            <TouchableOpacity key={item.key} onPress={() => setActiveTab(item.key)} style={styles.navItem}>
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              <Text style={{ fontSize: 10, color: isActive ? '#10B981' : themeSubtext, fontWeight: isActive ? '700' : '400', marginTop: 2 }}>
                {item.key}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Recipe Process Modal */}
      <Modal
        visible={!!selectedRecipeModal}
        animationType="slide"
        onRequestClose={() => setSelectedRecipeModal(null)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: themeBg, paddingTop: STATUSBAR_HEIGHT }]}>
          <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

          {/* Modal Header Bar */}
          <View style={[styles.headerBar, { backgroundColor: themeCard, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <TouchableOpacity onPress={() => setSelectedRecipeModal(null)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#10B981', fontWeight: '700' }}>← Back to App</Text>
            </TouchableOpacity>
            <Text style={{ fontWeight: '700', color: themeText, fontSize: 16 }}>Recipe & Preparation</Text>
            <TouchableOpacity onPress={() => selectedRecipeModal && toggleFav(selectedRecipeModal.id)}>
              <Text style={{ fontSize: 20 }}>{selectedRecipeModal && favorites.includes(selectedRecipeModal.id) ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          {selectedRecipeModal && (
            <ScrollView style={{ flex: 1, padding: 16 }}>
              {/* Recipe Hero Banner */}
              <View style={[styles.foodEmojiContainer, { backgroundColor: selectedRecipeModal.bg, height: 130, borderRadius: 20, marginBottom: 16 }]}>
                <Text style={{ fontSize: 60 }}>{selectedRecipeModal.emoji}</Text>
              </View>

              <Text style={[styles.welcomeTitle, { color: themeText, fontSize: 20 }]}>{selectedRecipeModal.title}</Text>

              {/* Tags & Meta Badges */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 10 }}>
                <View style={[styles.catChip, { backgroundColor: '#10B981' }]}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>🔥 {selectedRecipeModal.calories} kcal</Text></View>
                <View style={[styles.catChip, { backgroundColor: '#0EA5E9' }]}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>⏱️ Prep: {selectedRecipeModal.prepTime || '10 mins'}</Text></View>
                <View style={[styles.catChip, { backgroundColor: '#8B5CF6' }]}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>🍳 Cook: {selectedRecipeModal.cookTime || '20 mins'}</Text></View>
                <View style={[styles.catChip, { backgroundColor: '#F59E0B' }]}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>🍽️ {selectedRecipeModal.servings || '2 Servings'}</Text></View>
              </View>

              {/* Mood Benefits Card */}
              <View style={[styles.bannerCard, { backgroundColor: '#E6F4EA', marginVertical: 10 }]}>
                <Text style={{ fontWeight: '700', color: '#10B981', fontSize: 14 }}>
                  🧠 Mood Benefit ({selectedRecipeModal.emotion} {EMOTION_EMOJIS[selectedRecipeModal.emotion]})
                </Text>
                <Text style={{ color: '#065F46', fontSize: 12, marginTop: 4 }}>
                  {selectedRecipeModal.benefits}
                </Text>
              </View>

              {/* Description */}
              <Text style={{ color: themeSubtext, fontSize: 13, marginBottom: 16 }}>
                {selectedRecipeModal.desc}
              </Text>

              {/* Ingredients List */}
              <Text style={[styles.sectionTitle, { color: themeText, marginBottom: 10 }]}>🥕 Ingredients Needed:</Text>
              <View style={[styles.cardBox, { backgroundColor: themeCard, marginBottom: 16 }]}>
                {(selectedRecipeModal.ingredients && selectedRecipeModal.ingredients.length > 0 ? selectedRecipeModal.ingredients : [
                  `200g ${selectedRecipeModal.title} Base Ingredients`,
                  '1 tbsp Olive Oil or Pure Ghee',
                  '1/2 tsp Himalayan Salt & Spices to taste',
                  'Fresh herbs & cilantro for garnish'
                ]).map((item, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                    <Text style={{ fontSize: 14, color: '#10B981', marginRight: 8 }}>✓</Text>
                    <Text style={{ color: themeText, fontSize: 13 }}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Step by Step Cooking Process */}
              <Text style={[styles.sectionTitle, { color: themeText, marginBottom: 10 }]}>👩‍🍳 Step-by-Step Preparation Process:</Text>
              <View style={{ marginBottom: 24 }}>
                {(selectedRecipeModal.instructions && selectedRecipeModal.instructions.length > 0 ? selectedRecipeModal.instructions : [
                  `Prepare fresh ingredients and spices for ${selectedRecipeModal.title}.`,
                  'Heat oil or ghee in a cooking pan over medium flame.',
                  'Add aromatics and sauté until fragrant and oil separates.',
                  'Simmer ingredients gently until perfectly cooked and flavorful.',
                  `Garnish with fresh herbs and serve your hot ${selectedRecipeModal.title}!`
                ]).map((step, idx) => (
                  <View key={idx} style={[styles.cardBox, { backgroundColor: themeCard, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start' }]}>
                    <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 2 }}>
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{idx + 1}</Text>
                    </View>
                    <Text style={{ flex: 1, color: themeText, fontSize: 13, lineHeight: 18 }}>{step}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, { marginBottom: 40 }]}
                onPress={() => {
                  Alert.alert("Meal Logged 🎉", `Recorded ${selectedRecipeModal.title} (${selectedRecipeModal.calories} kcal) into your daily food intake!`);
                  setSelectedRecipeModal(null);
                }}
              >
                <Text style={styles.primaryBtnText}>Log This Meal & Complete  ✓</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, elevation: 2, borderBottomWidth: 1, borderColor: '#E2E8F0' },
  topLogoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoGroup: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 18, fontWeight: '700', marginLeft: 6 },
  notifBadge: { position: 'relative' },
  badgeDot: { position: 'absolute', top: -2, right: -2, backgroundColor: 'red', borderRadius: 8, width: 14, height: 14, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  topTabScroll: { marginTop: 10 },
  topTabChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 6 },
  topTabChipActive: { backgroundColor: '#E6F4EA' },
  topTabText: { fontSize: 13 },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  welcomeTitle: { fontSize: 20, fontWeight: '700' },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  bannerCard: { backgroundColor: '#E6F4EA', borderRadius: 16, padding: 16, marginBottom: 16 },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: '#10B981' },
  bannerSub: { fontSize: 12, color: '#065F46', marginVertical: 6 },
  primaryBtn: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  waterWidget: { backgroundColor: '#E0F2FE', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  carouselCard: { width: 180, borderRadius: 14, padding: 10, marginRight: 10, elevation: 1 },
  foodEmojiContainer: { height: 90, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  foodTitle: { fontSize: 13, fontWeight: '700', marginTop: 8 },
  screenTitle: { fontSize: 20, fontWeight: '700' },
  stepHeading: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emotionCard: { width: '31%', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 2 },
  cardBox: { padding: 14, borderRadius: 14, elevation: 1 },
  intensityBarTrack: { height: 10, backgroundColor: '#E2E8F0', borderRadius: 5, marginTop: 10, overflow: 'hidden' },
  intensityBarFill: { height: '100%', backgroundColor: '#10B981' },
  searchInput: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', fontSize: 13 },
  aiBadgeBanner: { backgroundColor: '#E6F4EA', padding: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  pillBtnGreen: { backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  pillBtnOutline: { borderWidth: 1, borderColor: '#10B981', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  catChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#E2E8F0', marginRight: 6 },
  catChipActive: { backgroundColor: '#10B981' },
  foodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCard: { width: '48%', padding: 10, borderRadius: 14, elevation: 1 },
  gridEmojiBox: { height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  favBtn: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: 4 },
  gridFoodTitle: { fontSize: 12, fontWeight: '700', marginTop: 6 },
  blueHeroCard: { backgroundColor: '#0EA5E9', borderRadius: 20, padding: 20, alignItems: 'center' },
  blueCircleProgress: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#0284C7', justifyContent: 'center', alignItems: 'center' },
  targetBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 12 },
  quickWaterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  waterPill: { width: '23%', padding: 10, borderRadius: 12, alignItems: 'center' },
  glassesCounterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  botHeaderCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, elevation: 1 },
  botAvatarCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E6F4EA', justifyContent: 'center', alignItems: 'center' },
  chatBubble: { padding: 12, borderRadius: 14, marginVertical: 4, maxWidth: '80%' },
  botBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#10B981', borderBottomRightRadius: 2 },
  chatPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 6 },
  chatInput: { flex: 1, padding: 10, borderRadius: 20, borderWidth: 1, borderColor: '#CBD5E1', fontSize: 13 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  barChartRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 100 },
  barCol: { width: 24, backgroundColor: '#10B981', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, justifyContent: 'space-between' },
  userAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  hydratedBadge: { backgroundColor: '#E6F4EA', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
  waterSettingCard: { backgroundColor: '#E0F2FE', padding: 14, borderRadius: 14, marginTop: 12 },
  freqChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#fff' },
  blueBtn: { backgroundColor: '#0EA5E9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  outlineBlueBtn: { borderWidth: 1, borderColor: '#0EA5E9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  bottomNavBar: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, paddingBottom: Platform.OS === 'android' ? 34 : 12, borderTopWidth: 1, borderColor: '#E2E8F0' },
  navItem: { alignItems: 'center', paddingVertical: 2 },
  logoutPillBtn: { borderWidth: 1, borderColor: '#FCA5A5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: '#FEF2F2' },
  fullLogoutBtn: { backgroundColor: '#FEE2E2', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  fullLogoutBtnText: { color: '#DC2626', fontWeight: '700', fontSize: 14 }
});

