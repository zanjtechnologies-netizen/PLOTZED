-- ================================================
-- Publish All Plots Script
-- Run this in your production database to ensure all plots are published
-- ================================================

-- Update all plots to be published
UPDATE plots
SET is_published = true
WHERE is_published = false OR is_published IS NULL;

-- Verify the update
SELECT
  COUNT(*) as total_plots,
  SUM(CASE WHEN is_published = true THEN 1 ELSE 0 END) as published_plots,
  SUM(CASE WHEN is_published = false OR is_published IS NULL THEN 1 ELSE 0 END) as unpublished_plots
FROM plots;

-- Show all plots with their published status
SELECT
  id,
  title,
  slug,
  is_published,
  is_featured,
  status,
  created_at
FROM plots
ORDER BY is_featured DESC, created_at DESC;
