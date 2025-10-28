export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""

    // Provide comprehensive healthcare responses based on the question
    let fallbackResponse = ""

    // Pregnancy Care Questions
    if (lastMessage.includes("stages of pregnancy") || lastMessage.includes("pregnancy stages")) {
      fallbackResponse = `**Stages of Pregnancy:**

**First Trimester (Weeks 1-12):**
• Baby's organs begin to form
• You may experience morning sickness
• Attend your first antenatal visit
• Take folic acid supplements

**Second Trimester (Weeks 13-26):**
• You'll start to feel baby move
• Your belly grows larger
• Continue regular checkups
• Eat nutritious foods

**Third Trimester (Weeks 27-40):**
• Baby grows rapidly
• Prepare for delivery
• Watch for labor signs
• Pack your hospital bag

📍 Visit Princess Christian Maternity Hospital (FQRJ+2CP Fourah Bay, Freetown) for care.`
    } else if (
      lastMessage.includes("antenatal") ||
      lastMessage.includes("checkup") ||
      lastMessage.includes("check-up")
    ) {
      fallbackResponse = `**Antenatal Checkup Schedule:**

**First Visit:** As soon as you know you're pregnant
**Months 1-6:** Once per month
**Months 7-8:** Every 2 weeks
**Month 9:** Every week until delivery

**What happens at checkups:**
✓ Blood pressure check
✓ Baby's heartbeat monitoring
✓ Urine and blood tests
✓ Weight measurement
✓ Vaccinations (tetanus)
✓ Iron and folic acid supplements

**Important:** Never miss your antenatal appointments! They help ensure a healthy pregnancy.

📞 Book an appointment through our app or call Princess Christian Maternity Hospital.`
    } else if (
      lastMessage.includes("danger sign") ||
      lastMessage.includes("warning sign") ||
      lastMessage.includes("emergency")
    ) {
      fallbackResponse = `**⚠️ PREGNANCY DANGER SIGNS - SEEK HELP IMMEDIATELY:**

**Call 117 or go to the hospital if you experience:**

🚨 **Severe bleeding** from the vagina
🚨 **Severe headache** with blurred vision
🚨 **High fever** (above 38°C)
🚨 **Severe abdominal pain**
🚨 **Convulsions or fits**
🚨 **Swelling** of face, hands, and feet
🚨 **Baby stops moving** or moves less
🚨 **Water breaks** before labor
🚨 **Difficulty breathing**
🚨 **Severe vomiting** (can't keep food down)

**DO NOT WAIT! These are emergencies.**

📞 Emergency: 117
🏥 Princess Christian Maternity Hospital: Open 24 hours`
    } else if (lastMessage.includes("healthy pregnancy") || lastMessage.includes("pregnancy tips")) {
      fallbackResponse = `**Tips for a Healthy Pregnancy:**

**Nutrition:**
🥗 Eat plenty of vegetables and fruits
🥚 Include proteins (eggs, fish, beans)
🥛 Drink milk for calcium
💧 Drink 8-10 glasses of water daily
🚫 Avoid alcohol and smoking

**Health Practices:**
✓ Sleep under a treated mosquito net
✓ Take your iron and folic acid tablets
✓ Attend all antenatal checkups
✓ Get adequate rest (8 hours sleep)
✓ Exercise gently (walking is great)
✓ Wash hands before eating

**Avoid:**
❌ Heavy lifting
❌ Stress and anxiety
❌ Raw or undercooked food
❌ Unprescribed medications

Remember: A healthy mother = a healthy baby!`
    }

    // Nutrition Questions
    else if (lastMessage.includes("food") && (lastMessage.includes("eat") || lastMessage.includes("nutrition"))) {
      fallbackResponse = `**Foods to Eat During Pregnancy:**

**Proteins (Build baby's body):**
• Fish (well-cooked)
• Eggs
• Beans and groundnuts
• Chicken and meat

**Vegetables (Vitamins & minerals):**
• Dark green leafy vegetables (potato leaves, cassava leaves)
• Carrots
• Tomatoes
• Okra

**Fruits (Vitamins):**
• Oranges, mangoes, bananas
• Papaya, pineapple
• Watermelon

**Carbohydrates (Energy):**
• Rice, cassava, yams
• Bread, plantains

**Dairy (Calcium for bones):**
• Milk, yogurt

**Important:**
✓ Eat 3 meals + 2 snacks daily
✓ Take iron and folic acid supplements
✓ Drink plenty of clean water

🚫 **Avoid:** Alcohol, raw fish, unwashed fruits, too much caffeine`
    } else if (lastMessage.includes("avoid") && lastMessage.includes("food")) {
      fallbackResponse = `**Foods to Avoid During Pregnancy:**

**Completely Avoid:**
🚫 Alcohol (causes birth defects)
🚫 Smoking and tobacco
🚫 Raw or undercooked meat/fish
🚫 Unpasteurized milk
🚫 Unwashed fruits and vegetables

**Limit These:**
⚠️ Caffeine (coffee, tea) - max 1 cup/day
⚠️ Very spicy foods (if they upset your stomach)
⚠️ Too much sugar and salt

**Food Safety:**
✓ Wash all fruits and vegetables
✓ Cook meat and fish thoroughly
✓ Drink clean, boiled water
✓ Avoid street food if hygiene is poor
✓ Store food properly

**Why?** These foods can harm your baby or make you sick during pregnancy.`
    } else if (lastMessage.includes("water") || lastMessage.includes("drink")) {
      fallbackResponse = `**Water & Hydration During Pregnancy:**

**How much:** 8-10 glasses (2-3 liters) per day

**Why it's important:**
💧 Helps baby's development
💧 Prevents constipation
💧 Reduces swelling
💧 Prevents urinary infections
💧 Keeps you energized
💧 Helps produce breast milk

**Tips:**
✓ Drink clean, boiled water
✓ Carry a water bottle
✓ Drink more in hot weather
✓ Drink before you feel thirsty
✓ Add lemon for taste

**Signs you need more water:**
• Dark yellow urine
• Dry mouth
• Headaches
• Dizziness

**Other healthy drinks:**
• Fresh fruit juice (no added sugar)
• Coconut water
• Milk

🚫 Avoid: Alcohol, too much caffeine, sugary drinks`
    } else if (lastMessage.includes("vitamin") || lastMessage.includes("supplement")) {
      fallbackResponse = `**Vitamins & Supplements During Pregnancy:**

**Essential Supplements:**

**1. Folic Acid (Most Important!)**
• Take BEFORE and during pregnancy
• Prevents birth defects
• Dose: 400-800 mcg daily
• Found in: Green leafy vegetables, beans

**2. Iron**
• Prevents anemia
• Helps baby's growth
• Take with vitamin C (orange juice)
• Found in: Meat, beans, dark greens

**3. Calcium**
• Builds baby's bones and teeth
• Dose: 1000 mg daily
• Found in: Milk, yogurt, fish with bones

**4. Vitamin D**
• Helps absorb calcium
• Get from sunlight (15 min/day)

**Where to get them:**
✓ Free at antenatal clinics
✓ Take as prescribed by your healthcare provider

**Important:** 
• Take supplements with food
• Don't take more than prescribed
• Continue after delivery while breastfeeding`
    }

    // Malaria Prevention
    else if (lastMessage.includes("malaria")) {
      fallbackResponse = `**Malaria Prevention During Pregnancy:**

**Why it's dangerous:**
Malaria during pregnancy can cause:
• Severe anemia
• Premature birth
• Low birth weight
• Miscarriage
• Maternal death

**How to Protect Yourself:**

**1. Sleep Under a Treated Mosquito Net**
✓ Use EVERY night
✓ Tuck net under mattress
✓ Check for holes
✓ Re-treat every 6-12 months

**2. Remove Standing Water**
✓ Empty containers, tires, pots
✓ Cover water storage
✓ Clear gutters
✓ Fill holes in ground

**3. Prevent Mosquito Bites**
✓ Wear long sleeves at dusk
✓ Use mosquito repellent (safe for pregnancy)
✓ Keep windows closed or screened

**4. Take Preventive Medicine**
✓ Get IPTp (malaria prevention tablets) at antenatal clinic
✓ Take as prescribed

**Symptoms:** Fever, chills, headache, body aches
**Action:** Go to clinic immediately if you have these symptoms!

🏥 Get free treated nets at health centers`
    } else if (lastMessage.includes("mosquito net") || lastMessage.includes("treated net")) {
      fallbackResponse = `**Sleeping Under a Treated Mosquito Net:**

**Why it's important:**
🛡️ Protects you and baby from malaria
🛡️ Prevents mosquito bites while you sleep
🛡️ Reduces risk of severe illness

**How to Use Properly:**

**1. Setup:**
• Hang net over your bed
• Make sure it covers all sides
• Tuck edges under mattress
• Check for holes or tears

**2. Daily Use:**
• Use EVERY night, all year
• Get inside before mosquitoes come (dusk)
• Keep net tucked in all night
• Don't sleep with net touching your body

**3. Maintenance:**
• Wash every 2-3 months with mild soap
• Dry in shade (not direct sun)
• Repair small holes immediately
• Re-treat every 6-12 months

**Where to Get:**
✓ Free at antenatal clinics
✓ Free at health centers
✓ Community health workers

**Remember:** One bite can cause malaria. Use your net every night!`
    } else if (lastMessage.includes("standing water") || lastMessage.includes("remove water")) {
      fallbackResponse = `**Removing Standing Water to Prevent Malaria:**

**Why it matters:**
Mosquitoes lay eggs in standing water. No water = No mosquitoes!

**What to Do:**

**Around Your Home:**
✓ Empty all containers (buckets, pots, tires)
✓ Turn containers upside down
✓ Cover water storage drums tightly
✓ Change flower vase water weekly
✓ Clear blocked gutters
✓ Fill holes in ground where water collects

**In Your Compound:**
✓ Dispose of old tires properly
✓ Clear bushes and tall grass
✓ Drain stagnant pools
✓ Keep environment clean

**Water Storage:**
✓ Cover all water containers
✓ Use containers with tight lids
✓ Clean storage containers weekly

**Community Action:**
✓ Work with neighbors to clear drains
✓ Report blocked drains to authorities
✓ Keep community clean

**Check Weekly:**
Look for standing water after rain and empty it immediately!

🦟 No standing water = Fewer mosquitoes = Less malaria`
    } else if (lastMessage.includes("malaria symptom")) {
      fallbackResponse = `**Malaria Symptoms During Pregnancy:**

**Common Symptoms:**
🌡️ High fever (feeling very hot)
🥶 Chills and shaking
😰 Sweating
🤕 Severe headache
💪 Body aches and weakness
🤢 Nausea and vomiting
😴 Extreme tiredness

**Severe Symptoms (Emergency!):**
🚨 Very high fever
🚨 Confusion or unconsciousness
🚨 Difficulty breathing
🚨 Severe anemia (very pale)
🚨 Convulsions
🚨 Bleeding

**What to Do:**

**If you have symptoms:**
1. Go to health center IMMEDIATELY
2. Don't wait or try home remedies
3. Get tested for malaria
4. Start treatment right away

**Important:**
• Malaria in pregnancy is VERY dangerous
• Early treatment saves lives
• Complete full course of medicine
• Return if symptoms don't improve

**Prevention is better than cure!**
✓ Sleep under treated net
✓ Take preventive medicine from clinic
✓ Remove standing water

📞 Emergency: 117`
    }

    // Baby Care
    else if (lastMessage.includes("newborn") || lastMessage.includes("baby care")) {
      fallbackResponse = `**Caring for Your Newborn Baby:**

**First 24 Hours:**
✓ Start breastfeeding within 1 hour
✓ Keep baby warm (skin-to-skin)
✓ Don't bathe immediately
✓ Get baby checked by health worker

**Daily Care:**

**Feeding:**
🍼 Breastfeed exclusively (no water, no other food)
🍼 Feed on demand (8-12 times/day)
🍼 Both breasts each feeding

**Hygiene:**
🛁 Bathe with warm water daily
🧼 Use mild soap
👐 Wash hands before touching baby
🧷 Keep umbilical cord clean and dry

**Sleep:**
😴 Baby sleeps 16-18 hours/day
😴 Always place baby on back to sleep
😴 Sleep in same room (not same bed)

**Health:**
✓ Attend all vaccination appointments
✓ Keep baby warm
✓ Protect from mosquitoes (net)
✓ Watch for danger signs

**Danger Signs - Go to clinic immediately:**
🚨 Difficulty breathing
🚨 Not feeding well
🚨 Fever or very cold
🚨 Yellow skin/eyes
🚨 Umbilical cord red or smelly

Love and cuddle your baby often! 💕`
    } else if (lastMessage.includes("breastfeed")) {
      fallbackResponse = `**Breastfeeding Guide:**

**Why Breastfeed:**
💚 Perfect nutrition for baby
💚 Protects against infections
💚 Helps mother's womb contract
💚 Creates strong bond
💚 Free and always available
💚 Reduces risk of breast cancer

**How to Breastfeed:**

**1. Position:**
• Sit comfortably
• Hold baby close, tummy to tummy
• Support baby's head and neck
• Bring baby to breast (not breast to baby)

**2. Latch:**
• Baby's mouth wide open
• Covers most of areola (dark area)
• Lips turned outward
• No pain (if painful, relatch)

**3. Feeding:**
• Feed on demand (when baby wants)
• 8-12 times per day
• Let baby finish one breast first
• Offer second breast

**First 6 Months:**
✓ ONLY breast milk (no water, no other food)
✓ Day and night feeding
✓ No bottles or pacifiers

**After 6 Months:**
✓ Continue breastfeeding
✓ Add complementary foods
✓ Breastfeed for 2 years or more

**Tips:**
• Drink plenty of water
• Eat nutritious food
• Rest when baby sleeps
• Ask for help if needed

**Problems?** Visit health center for support!`
    } else if (lastMessage.includes("vaccination") || lastMessage.includes("immunization")) {
      fallbackResponse = `**Baby Vaccination Schedule:**

**At Birth:**
• BCG (tuberculosis)
• Polio 0
• Hepatitis B

**6 Weeks:**
• Polio 1
• Pentavalent 1 (DPT-HepB-Hib)
• Pneumococcal 1
• Rotavirus 1

**10 Weeks:**
• Polio 2
• Pentavalent 2
• Pneumococcal 2
• Rotavirus 2

**14 Weeks:**
• Polio 3
• Pentavalent 3
• Pneumococcal 3

**9 Months:**
• Measles
• Yellow Fever

**18 Months:**
• Measles booster

**Why Vaccinations Matter:**
✓ Prevent deadly diseases
✓ Protect your baby's health
✓ Free at health centers
✓ Safe and effective

**Important:**
• Keep vaccination card safe
• Don't miss appointments
• Bring card to every visit
• Complete all doses

**Where:** All government health centers provide free vaccinations

📅 Mark dates on your calendar!`
    } else if (lastMessage.includes("healthy baby") || lastMessage.includes("baby healthy")) {
      fallbackResponse = `**Signs of a Healthy Baby:**

**Good Signs:**
✓ Feeds well (8-12 times/day)
✓ Wet diapers (6+ per day)
✓ Gaining weight steadily
✓ Alert when awake
✓ Cries when needs something
✓ Sleeps well
✓ Skin pink and warm
✓ Breathing easily

**Growth Milestones:**

**0-3 Months:**
• Lifts head briefly
• Follows objects with eyes
• Smiles
• Makes cooing sounds

**3-6 Months:**
• Rolls over
• Sits with support
• Reaches for objects
• Laughs

**6-12 Months:**
• Sits without support
• Crawls
• Stands with support
• Says simple words

**Health Checks:**
✓ Regular weight checks
✓ All vaccinations on time
✓ Development monitoring
✓ Vision and hearing checks

**When to Worry (See doctor):**
🚨 Not feeding well
🚨 Not gaining weight
🚨 Very sleepy or irritable
🚨 Not reaching milestones
🚨 Fever or illness

**Remember:** Every baby develops at their own pace, but regular checkups ensure healthy growth!`
    }

    // Health Services
    else if (
      lastMessage.includes("clinic near") ||
      lastMessage.includes("find clinic") ||
      lastMessage.includes("hospital near")
    ) {
      fallbackResponse = `**Health Facilities in Sierra Leone:**

**Featured Hospital:**
🏥 **Princess Christian Maternity Hospital**
📍 FQRJ+2CP Fourah Bay, Freetown
⏰ Open 24 hours
📞 Contact through our app
🌐 Full maternity services

**Other Major Facilities:**

**Freetown:**
• Connaught Hospital
• Ola During Children's Hospital
• Police Hospital

**Regional:**
• Bo Government Hospital
• Kenema Government Hospital
• Makeni Government Hospital

**Services Available:**
✓ Antenatal care
✓ Delivery services
✓ Postnatal care
✓ Family planning
✓ Child health services
✓ Emergency care

**How to Find:**
• Use our app's "Book Appointment" feature
• Visit nearest health center
• Ask community health worker

**Free Services:**
✓ Antenatal care
✓ Delivery
✓ Postnatal care
✓ Child vaccinations
✓ Family planning

📱 Book appointments through our app!`
    } else if (lastMessage.includes("book appointment") || lastMessage.includes("appointment")) {
      fallbackResponse = `**How to Book an Appointment:**

**Through Our App:**
1. Click "Book Appointment" button
2. Select clinic/hospital
3. Choose date and time
4. Fill in your details
5. Confirm booking

**What to Bring:**
📋 Antenatal card (if you have one)
📋 ID card
📋 Previous medical records
📋 List of medications you take

**Types of Appointments:**

**Antenatal Care:**
• First visit: Comprehensive checkup
• Follow-up visits: Monitoring
• Ultrasound scans
• Blood tests

**Postnatal Care:**
• Mother checkup (within 6 weeks)
• Baby checkup
• Family planning counseling

**Emergency:**
• No appointment needed
• Go directly to hospital
• Call 117 for ambulance

**Tips:**
✓ Arrive 15 minutes early
✓ Bring someone with you
✓ Write down questions to ask
✓ Don't miss appointments

**Free Services:**
All maternal and child health services are FREE at government facilities!

📞 Need help? Contact Princess Christian Maternity Hospital`
    } else if (lastMessage.includes("health center service") || lastMessage.includes("what services")) {
      fallbackResponse = `**Services at Health Centers:**

**Maternal Health:**
✓ Antenatal care (pregnancy checkups)
✓ Delivery services
✓ Postnatal care (after birth)
✓ Family planning
✓ Pregnancy testing
✓ Ultrasound (some centers)

**Child Health:**
✓ Vaccinations (immunizations)
✓ Growth monitoring
✓ Treatment of childhood illnesses
✓ Nutrition counseling
✓ Vitamin A supplementation

**General Health:**
✓ Malaria testing and treatment
✓ HIV testing and counseling
✓ TB screening and treatment
✓ Treatment of common illnesses
✓ Health education

**Preventive Services:**
✓ Mosquito nets (free)
✓ Iron and folic acid tablets
✓ Deworming
✓ Health talks

**Emergency Services:**
✓ 24-hour emergency care
✓ Referral to hospitals
✓ Ambulance services

**All FREE for:**
• Pregnant women
• Children under 5
• Lactating mothers

**What to Expect:**
• Friendly health workers
• Confidential care
• Respectful treatment
• Quality services

Visit your nearest health center today!`
    } else if (lastMessage.includes("when") && lastMessage.includes("hospital")) {
      fallbackResponse = `**When to Go to the Hospital:**

**During Pregnancy - Go Immediately If:**
🚨 Severe bleeding
🚨 Severe headache with blurred vision
🚨 High fever
🚨 Severe abdominal pain
🚨 Water breaks before labor
🚨 Baby stops moving
🚨 Convulsions/fits
🚨 Severe swelling of face and hands

**During Labor - Go When:**
🤰 Contractions every 5 minutes
🤰 Water breaks
🤰 Bleeding
🤰 Severe pain
🤰 Baby not moving

**After Delivery - Go If:**
🩸 Heavy bleeding (soaking pad in 1 hour)
🩸 Severe abdominal pain
🩸 High fever
🩸 Foul-smelling discharge
🩸 Severe headache
🩸 Difficulty breathing

**For Baby - Go If:**
👶 Difficulty breathing
👶 Not feeding
👶 Fever or very cold
👶 Yellow skin/eyes
👶 Convulsions
👶 Vomiting everything

**Regular Visits:**
✓ All scheduled antenatal appointments
✓ Postnatal checkup (within 6 weeks)
✓ Baby vaccinations
✓ Any health concerns

**Emergency Number: 117**

**Remember:** It's better to go and be checked than to wait and risk complications!`
    }

    // Emergency Care
    else if (lastMessage.includes("emergency number") || lastMessage.includes("call for help")) {
      fallbackResponse = `**Emergency Contacts:**

**National Emergency Number:**
📞 **117** - For all medical emergencies

**When to Call 117:**
🚨 Severe bleeding
🚨 Difficulty breathing
🚨 Unconsciousness
🚨 Severe accidents
🚨 Convulsions
🚨 Severe pain
🚨 Complications during labor

**What to Say:**
1. Your location
2. Type of emergency
3. Patient's condition
4. Your phone number

**24-Hour Emergency Facilities:**

**Princess Christian Maternity Hospital**
📍 FQRJ+2CP Fourah Bay, Freetown
⏰ Open 24/7

**Other Emergency Contacts:**
• Connaught Hospital Emergency
• Police: 019
• Fire Service: 999

**Before Emergency:**
✓ Know nearest hospital location
✓ Save emergency numbers
✓ Have transport plan
✓ Keep antenatal card ready

**Don't Wait:**
If you think it's an emergency, it probably is. Call for help immediately!

**Remember:** Quick action saves lives!`
    } else if (
      lastMessage.includes("labor") ||
      lastMessage.includes("delivery") ||
      lastMessage.includes("giving birth")
    ) {
      fallbackResponse = `**Preparing for Labor and Delivery:**

**Signs of Labor:**
• Regular contractions (every 5-10 minutes)
• Water breaks (fluid from vagina)
• Bloody show (mucus with blood)
• Lower back pain
• Pressure in pelvis

**What to Pack (Hospital Bag):**

**For Mother:**
✓ Antenatal card
✓ ID card
✓ Clean clothes (2-3 sets)
✓ Underwear
✓ Sanitary pads
✓ Toiletries
✓ Slippers
✓ Phone and charger

**For Baby:**
✓ Baby clothes (3-4 sets)
✓ Blankets
✓ Diapers
✓ Baby cap and socks

**Birth Plan:**
• Where to deliver
• Who will accompany you
• Transport arrangement
• Emergency contact

**Stages of Labor:**

**Stage 1:** Contractions, cervix opens (longest)
**Stage 2:** Pushing, baby is born
**Stage 3:** Placenta delivery

**Pain Management:**
• Breathing techniques
• Walking and movement
• Support person
• Medical pain relief (if needed)

**After Delivery:**
✓ Immediate skin-to-skin contact
✓ Start breastfeeding within 1 hour
✓ Rest and recover
✓ Stay in hospital as advised

**When to Go:**
• Contractions every 5 minutes
• Water breaks
• Any concerns

**Remember:** Every birth is different. Trust your body and your healthcare team!

🏥 Deliver at a health facility for safety!`
    }

    // Default response for other questions
    else {
      fallbackResponse = `Thank you for your question! I'm here to help with maternal health topics.

**I can help you with:**
• Pregnancy care and antenatal visits
• Nutrition during pregnancy
• Malaria prevention
• Baby care and breastfeeding
• Health services and appointments
• Emergency care information

**Quick Tips:**
✓ Attend all antenatal checkups
✓ Sleep under a treated mosquito net
✓ Eat nutritious foods
✓ Drink plenty of water
✓ Take your supplements

**Need immediate help?**
📞 Emergency: 117
🏥 Princess Christian Maternity Hospital: Open 24/7

Please ask me a specific question about pregnancy, baby care, nutrition, malaria prevention, or health services, and I'll provide detailed information!

You can also:
• Book an appointment through our app
• Watch educational videos
• Read health articles

How can I help you today?`
    }

    return new Response(fallbackResponse, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)

    return new Response(
      `I apologize for the technical difficulty. 

**For immediate assistance:**
📞 Call 117 for emergencies
🏥 Visit Princess Christian Maternity Hospital
📱 Use our app to book appointments

**Common Topics:**
• Pregnancy care
• Nutrition
• Malaria prevention
• Baby care
• Health services

Please try asking your question again, or contact our support team.`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      },
    )
  }
}
