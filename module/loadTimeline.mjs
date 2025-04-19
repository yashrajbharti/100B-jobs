export const loadTimeline = (timeline) => {
  document
    .querySelector("timeline-component")
    .setAttribute("timeline", JSON.stringify(timeline));
};
