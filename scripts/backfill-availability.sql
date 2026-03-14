WITH profiles_without_slots AS (
  SELECT lp.id AS lawyer_profile_id
  FROM "LawyerProfile" lp
  WHERE NOT EXISTS (
    SELECT 1
    FROM "AvailabilitySlot" slot
    WHERE slot."lawyerProfileId" = lp.id
  )
),
default_slots AS (
  SELECT 1 AS weekday, '10:00' AS time
  UNION ALL
  SELECT 3 AS weekday, '14:30' AS time
  UNION ALL
  SELECT 5 AS weekday, '17:30' AS time
)
INSERT INTO "AvailabilitySlot" ("id", "lawyerProfileId", "weekday", "time", "createdAt", "updatedAt")
SELECT
  md5(random()::text || clock_timestamp()::text || profile.lawyer_profile_id || default_slot.weekday::text || default_slot.time),
  profile.lawyer_profile_id,
  default_slot.weekday,
  default_slot.time,
  NOW(),
  NOW()
FROM profiles_without_slots profile
CROSS JOIN default_slots default_slot;
