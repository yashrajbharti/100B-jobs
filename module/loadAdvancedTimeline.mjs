export const loadAdvancedTimeline = (timeline) => {
  document
    .querySelector("advanced-timeline-component")
    .setAttribute("timeline", JSON.stringify(timeline));
};
