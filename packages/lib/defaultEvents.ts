import { PeriodType, Prisma, SchedulingType } from "@prisma/client";

import { DailyLocationType } from "@calcom/app-store/locations";
import { userSelect } from "@calcom/prisma/selects";
import { CustomInputSchema, EventTypeMetaDataSchema } from "@calcom/prisma/zod-utils";

type User = Prisma.UserGetPayload<typeof userSelect>;

type UsernameSlugLinkProps = {
  users: {
    id?: number;
    username: string | null;
    email?: string;
    name?: string | null;
    bio?: string | null;
    avatar?: string | null;
    theme?: string | null;
    away?: boolean;
    verified?: boolean | null;
    allowDynamicBooking?: boolean | null;
  }[];
  slug: string;
};

const user: User = {
  theme: null,
  credentials: [],
  username: "john.doe",
  timeZone: "",
  bufferTime: 0,
  availability: [],
  id: 0,
  startTime: 0,
  endTime: 0,
  selectedCalendars: [],
  schedules: [],
  defaultScheduleId: null,
  locale: "en",
  email: "john.doe@example.com",
  name: "John doe",
  avatar: "",
  destinationCalendar: null,
  hideBranding: true,
  brandColor: "#797979",
  darkBrandColor: "#efefef",
  allowDynamicBooking: true,
};

const customInputs: CustomInputSchema[] = [];

const commons = {
  isDynamic: true,
  periodCountCalendarDays: true,
  periodStartDate: null,
  periodEndDate: null,
  beforeEventBuffer: 0,
  afterEventBuffer: 0,
  periodType: PeriodType.UNLIMITED,
  periodDays: null,
  slotInterval: null,
  locations: [{ type: DailyLocationType }],
  customInputs,
  disableGuests: true,
  minimumBookingNotice: 120,
  schedule: null,
  timeZone: null,
  successRedirectUrl: "",
  teamId: null,
  scheduleId: null,
  availability: [],
  price: 0,
  currency: "eur",
  schedulingType: SchedulingType.COLLECTIVE,
  seatsPerTimeSlot: null,
  seatsShowAttendees: null,
  id: 0,
  hideCalendarNotes: false,
  recurringEvent: null,
  destinationCalendar: null,
  team: null,
  requiresConfirmation: false,
  bookingLimits: null,
  hidden: false,
  userId: 0,
  owner: null,
  workflows: [],
  users: [user],
  hosts: [],
  metadata: EventTypeMetaDataSchema.parse({}),
};

const S1EG = {
  length: 30,
  slug: "s1-eg",
  title: "Erstgespräch",
  eventName: "S1 - Erstgespräch",
  description: "S1 - Erstgespräch",
  descriptionAsSafeHTML: "S1 - Erstgespräch",
  position: 0,
  ...commons,
};
const S2ZG = {
  length: 30,
  slug: "s2-zg",
  title: "Zweitgespräch",
  eventName: "S2 - Zweitgespräch",
  description: "S2 - Zweitgespräch",
  descriptionAsSafeHTML: "S2 - Zweitgespräch",
  position: 1,
  ...commons,
};
const S3FT = {
  length: 30,
  slug: "s3-ft",
  title: "Fragetermin",
  eventName: "S3 - Fragetermin",
  description: "S3 - Fragetermin",
  descriptionAsSafeHTML: "S3 - Fragetermin",
  position: 2,
  ...commons,
};
const AT = {
  length: 30,
  slug: "abschlusstermin",
  title: "Abschlusstermin",
  eventName: "Abschlusstermin",
  description: "Abschlusstermin",
  descriptionAsSafeHTML: "Abschlusstermin",
  position: 3,
  ...commons,
};

const defaultEvents = [S1EG, S2ZG, S3FT, AT];

export const getDynamicEventDescription = (dynamicUsernames: string[], title: string): string => {
  return `Book a ${title} with ${dynamicUsernames.join(", ")}`;
};

export const getDynamicEventName = (dynamicNames: string[], title: string): string => {
  const lastUser = dynamicNames.pop();
  return `${title} with ${dynamicNames.join(", ")} & ${lastUser}`;
};

export const getDefaultEvent = (slug: string) => {
  const event = defaultEvents.find((obj) => {
    return obj.slug === slug;
  });
  return event || S1EG;
};

export const getGroupName = (usernameList: string[]): string => {
  return usernameList.join(", ");
};

export const getUsernameSlugLink = ({ users, slug }: UsernameSlugLinkProps): string => {
  let slugLink = ``;
  if (users.length > 1) {
    const combinedUsername = users.map((user) => user.username).join("+");
    slugLink = `/${combinedUsername}/${slug}`;
  } else {
    slugLink = `/${users[0].username}/${slug}`;
  }
  return slugLink;
};

const arrayCast = (value: unknown | unknown[]) => {
  return Array.isArray(value) ? value : value ? [value] : [];
};

export const getUsernameList = (users: string | string[] | undefined): string[] => {
  // Multiple users can come in case of a team round-robin booking and in that case dynamic link won't be a user.
  // So, even though this code handles even if individual user is dynamic link, that isn't a possibility right now.
  users = arrayCast(users);

  const allUsers = users.map((user) =>
    user
      .toLowerCase()
      .replace(/( |%20)/g, "+")
      .split("+")
  );

  return Array.prototype.concat(...allUsers);
};

export default defaultEvents;
