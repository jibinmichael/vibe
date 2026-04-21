import type { HolidayHint, SegmentHint } from "@/components/campaign/MonthCalendar"

/**
 * Twelve months of holiday and segment-opportunity hints.
 * Keyed by 0-indexed month number (0 = January, 11 = December).
 * Zomato-voice observational copy: noticing you, low-key, slightly pointed.
 */

export const HOLIDAY_HINTS_BY_MONTH: Record<number, HolidayHint[]> = {
  0: [
    {
      id: "h-newyear",
      date: 1,
      holidayName: "NEW YEAR",
      message: "First day of the year. <b>A message would be nice.</b>",
    },
    {
      id: "h-makar",
      date: 14,
      holidayName: "MAKAR SANKRANTI",
      message: "Makar Sankranti. Your regional contacts will notice <b>who greets.</b>",
    },
    {
      id: "h-republic",
      date: 26,
      holidayName: "REPUBLIC DAY",
      message: "Republic Day. <b>Everyone else is messaging.</b>",
    },
  ],
  1: [
    {
      id: "h-valentines",
      date: 14,
      holidayName: "VALENTINE'S",
      message: "Valentine's Day. <b>Your loyal customers deserve the note.</b>",
    },
  ],
  2: [
    {
      id: "h-womens",
      date: 8,
      holidayName: "WOMEN'S DAY",
      message: "Women's Day. <b>Stats show brands that greet see +30% response.</b>",
    },
    {
      id: "h-holi",
      date: 14,
      holidayName: "HOLI",
      message: "Holi. Colour season. <b>Your calendar's still plain.</b>",
    },
  ],
  3: [
    {
      id: "h-baisakhi",
      date: 13,
      holidayName: "BAISAKHI",
      message: "Baisakhi. Harvest season in the north. <b>Worth a note?</b>",
    },
    {
      id: "h-good-fri",
      date: 18,
      holidayName: "GOOD FRIDAY",
      message: "Good Friday. <b>Quiet calendars don't feel respectful.</b>",
    },
  ],
  4: [
    {
      id: "h-labour",
      date: 1,
      holidayName: "LABOUR DAY",
      message: "Labour Day. Most brands thank customers. <b>Still nothing here.</b>",
    },
    {
      id: "h-mothers",
      date: 11,
      holidayName: "MOTHER'S DAY",
      message: "Mother's Day. <b>This one writes itself \u2014 and you haven't.</b>",
    },
  ],
  5: [
    {
      id: "h-fathers",
      date: 15,
      holidayName: "FATHER'S DAY",
      message: "Father's Day. <b>Your contact list remembers.</b>",
    },
    {
      id: "h-intl-yoga",
      date: 21,
      holidayName: "YOGA DAY",
      message: "International Yoga Day. Wellness brands go heavy today. <b>You?</b>",
    },
  ],
  6: [
    {
      id: "h-gurupurnima",
      date: 10,
      holidayName: "GURU PURNIMA",
      message: "Guru Purnima. <b>A thank-you message costs nothing.</b>",
    },
  ],
  7: [
    {
      id: "h-raksha",
      date: 9,
      holidayName: "RAKSHA BANDHAN",
      message: "Raksha Bandhan. <b>Family-segment opportunity. Nothing queued.</b>",
    },
    {
      id: "h-indep",
      date: 15,
      holidayName: "INDEPENDENCE DAY",
      message: "Independence Day. Your contacts are online. <b>The calendar isn't.</b>",
    },
    {
      id: "h-janmashtami",
      date: 16,
      holidayName: "JANMASHTAMI",
      message: "Janmashtami. <b>Regional brands move today.</b>",
    },
  ],
  8: [
    {
      id: "h-teachers",
      date: 5,
      holidayName: "TEACHERS' DAY",
      message: "Teachers' Day. <b>Warm. Easy. Still missing.</b>",
    },
    {
      id: "h-ganesh",
      date: 16,
      holidayName: "GANESH CHATURTHI",
      message: "Ganesh Chaturthi. <b>Maharashtra and Karnataka segments are ready.</b>",
    },
  ],
  9: [
    {
      id: "h-navratri",
      date: 13,
      holidayName: "NAVRATRI BEGINS",
      message: "Navratri begins. Nine nights of spend. <b>You're not in them.</b>",
    },
    {
      id: "h-dussehra",
      date: 22,
      holidayName: "DUSSEHRA",
      message: "Dussehra. <b>Biggest retail pulse of the week. Silent calendar.</b>",
    },
  ],
  10: [
    {
      id: "h-diwali",
      date: 10,
      holidayName: "DIWALI",
      message: "Diwali. The single highest-intent message day. <b>And nothing drafted.</b>",
    },
    {
      id: "h-bhaiduj",
      date: 12,
      holidayName: "BHAI DOOJ",
      message: "Bhai Dooj. <b>Your family-segment contacts expect something.</b>",
    },
  ],
  11: [
    {
      id: "h-hanukkah",
      date: 12,
      holidayName: "HANUKKAH",
      message: "Hanukkah starts tonight. Everyone else is greeting. <b>You?</b>",
    },
    {
      id: "h-christmas",
      date: 25,
      holidayName: "CHRISTMAS",
      message: "Christmas. Your contacts are ready. <b>The calendar isn't.</b>",
    },
    {
      id: "h-boxing",
      date: 26,
      holidayName: "BOXING DAY",
      message: "Boxing Day \u2014 biggest WA day of the year. <b>And nothing scheduled.</b>",
    },
    {
      id: "h-nye",
      date: 31,
      holidayName: "NYE",
      message: "Quiet NYE calendar. <b>Suspiciously quiet.</b>",
    },
  ],
}

export const SEGMENT_HINTS_BY_MONTH: Record<number, SegmentHint[]> = {
  0: [
    {
      id: "s-jan-vip",
      date: 5,
      tagLabel: "OPPORTUNITY",
      message: "45 days since <b>key accounts</b> last heard from you.",
    },
    {
      id: "s-jan-cart",
      date: 11,
      tagLabel: "OPPORTUNITY",
      message: "Pipeline stalling \u2014 <b>280 prospects</b> with no recent touch.",
    },
    {
      id: "s-jan-subs",
      date: 19,
      tagLabel: "OPPORTUNITY",
      message: "<b>94 new leads</b> this month. Onboarding sequence still not sent.",
    },
  ],
  1: [
    {
      id: "s-feb-lapsed",
      date: 6,
      tagLabel: "OPPORTUNITY",
      message: "Cold accounts haven't been re-activated in <b>60 days</b>.",
    },
    {
      id: "s-feb-love",
      date: 20,
      tagLabel: "OPPORTUNITY",
      message: "Dual-stakeholder accounts \u2014 <b>post-Valentine follow-up window</b> closing.",
    },
  ],
  2: [
    {
      id: "s-mar-eoq",
      date: 3,
      tagLabel: "OPPORTUNITY",
      message: "End-of-quarter approaching. <b>Champion relationships</b> primed for a timed play.",
    },
    {
      id: "s-mar-new",
      date: 19,
      tagLabel: "OPPORTUNITY",
      message: "<b>142 new leads</b>. First-touch nurture still sitting undrafted.",
    },
  ],
  3: [
    {
      id: "s-apr-vip",
      date: 3,
      tagLabel: "OPPORTUNITY",
      message: "30 days since you contacted <b>key accounts</b>. Last touch Mar 3.",
    },
    {
      id: "s-apr-cart",
      date: 9,
      tagLabel: "OPPORTUNITY",
      message: "Deals going quiet \u2014 <b>340 prospects</b> stalled with no owner follow-up.",
    },
    {
      id: "s-apr-lapsed",
      date: 17,
      tagLabel: "OPPORTUNITY",
      message: "Promising accounts haven't heard from you in <b>60 days</b>.",
    },
    {
      id: "s-apr-subs",
      date: 22,
      tagLabel: "OPPORTUNITY",
      message: "<b>128 new leads</b> in the last week. First-touch nurture not sent.",
    },
  ],
  4: [
    {
      id: "s-may-cart",
      date: 7,
      tagLabel: "OPPORTUNITY",
      message: "Pre-summer push: stalled pipeline <b>climbing</b> as discovery calls pick up.",
    },
    {
      id: "s-may-vip",
      date: 21,
      tagLabel: "OPPORTUNITY",
      message: "Strategic accounts \u2014 <b>no tailored executive touch</b> in 45 days.",
    },
  ],
  5: [
    {
      id: "s-jun-new",
      date: 4,
      tagLabel: "OPPORTUNITY",
      message: "<b>215 new leads</b> since Q1. Onboarding sequence still untouched.",
    },
    {
      id: "s-jun-lapsed",
      date: 18,
      tagLabel: "OPPORTUNITY",
      message: "Warm pipeline drifting cold. <b>60-day silence.</b>",
    },
  ],
  6: [
    {
      id: "s-jul-monsoon",
      date: 2,
      tagLabel: "OPPORTUNITY",
      message: "Monsoon season. <b>Regional intent peaks</b> \u2014 prime moment for outreach.",
    },
    {
      id: "s-jul-cart",
      date: 16,
      tagLabel: "OPPORTUNITY",
      message: "Opportunities piling up in nurture. <b>Re-engage window closing.</b>",
    },
  ],
  7: [
    {
      id: "s-aug-vip",
      date: 5,
      tagLabel: "OPPORTUNITY",
      message: "Top accounts went <b>60 days</b> without a tailored message.",
    },
    {
      id: "s-aug-festival",
      date: 22,
      tagLabel: "OPPORTUNITY",
      message: "Peak campaign season ahead. <b>Pre-festival warm-up not drafted.</b>",
    },
  ],
  8: [
    {
      id: "s-sep-lapsed",
      date: 4,
      tagLabel: "OPPORTUNITY",
      message: "<b>Dormant pipeline</b> growing. 380 contacts need a fresh angle.",
    },
    {
      id: "s-sep-navratri",
      date: 22,
      tagLabel: "OPPORTUNITY",
      message: "Pre-Navratri. <b>Regional audiences expect early outreach.</b>",
    },
  ],
  9: [
    {
      id: "s-oct-festive",
      date: 6,
      tagLabel: "OPPORTUNITY",
      message: "Peak planning window opens. <b>Your calendar still looks thin.</b>",
    },
    {
      id: "s-oct-vip",
      date: 19,
      tagLabel: "OPPORTUNITY",
      message: "Flagship campaign preview \u2014 <b>others in your category already live.</b>",
    },
  ],
  10: [
    {
      id: "s-nov-bfcm",
      date: 6,
      tagLabel: "OPPORTUNITY",
      message: "Year-end close season incoming. <b>Warm-up sequence not drafted.</b>",
    },
    {
      id: "s-nov-cart",
      date: 20,
      tagLabel: "OPPORTUNITY",
      message: "Post-festival momentum fading \u2014 deal stall rate <b>at a 3-month high</b>.",
    },
  ],
  11: [
    {
      id: "s-dec-vip",
      date: 3,
      tagLabel: "OPPORTUNITY",
      message: "30 days since you contacted <b>key accounts</b>. Last touch Nov 3.",
    },
    {
      id: "s-dec-cart",
      date: 9,
      tagLabel: "OPPORTUNITY",
      message: "Pipeline noise rising \u2014 <b>340 prospects</b> without a recent touch.",
    },
    {
      id: "s-dec-lapsed",
      date: 17,
      tagLabel: "OPPORTUNITY",
      message: "High-value relationships haven't heard from you in <b>60 days</b>.",
    },
    {
      id: "s-dec-subs",
      date: 22,
      tagLabel: "OPPORTUNITY",
      message: "<b>128 new leads</b> in the last week. First-touch nurture not sent.",
    },
  ],
}

export function getHolidayHints(monthIndex: number): HolidayHint[] {
  return HOLIDAY_HINTS_BY_MONTH[monthIndex] ?? []
}

export function getSegmentHints(monthIndex: number): SegmentHint[] {
  return SEGMENT_HINTS_BY_MONTH[monthIndex] ?? []
}
