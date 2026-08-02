# Narrative Visualization Essay: Global Temperature Change

## Messaging

The message of this visualization is that recent global temperatures are not simply a few isolated warm years. The historical record shows a larger change: most early years were below the 1951–1980 average, positive anomalies became more common after 1980, and the highest values appear near the end of the record.

The data come from NASA GISS GISTEMP v4. The chart displays annual global temperature anomalies from 1880 through 2025. An anomaly is the difference between a year's temperature and the 1951–1980 average, measured in degrees Celsius.

## Narrative Structure

I used an interactive slideshow with three scenes. The viewer moves through the scenes with Previous and Next buttons. The first two scenes present the story in a fixed order. The final scene shows the complete record and allows the viewer to inspect individual years with tooltips.

This structure helps the viewer understand the earlier temperatures before seeing the recent record values. The viewer first learns the baseline, then sees the change after 1980, and finally sees where the warmest years occur.

## Visual Structure

All three scenes use the same line-chart structure. The horizontal axis shows year, and the vertical axis shows temperature anomaly in degrees Celsius. A dashed horizontal line marks zero, which represents the 1951–1980 average.

The first scene uses a blue line for the early record. In the second and third scenes, older data are shown in gray while the important period is highlighted in orange. This makes the focus of each scene clear while preserving the earlier context. The chart dimensions, axes, typography, and navigation remain consistent between scenes. A short fade helps show that the scenes are different states of the same chart.

The scene title and short paragraph explain what the viewer should notice. The scene counter and disabled button states show the current position and the available navigation choices.

## Scenes

Scene 1 is “A Cooler Starting Point.” It displays data from 1880 through 1979. Most of the values are below the baseline. The annotation identifies 1909, which was 0.49°C below the baseline.

Scene 2 is “The Pattern Changes After 1980.” It extends the line through 2014 and highlights the portion beginning in 1980. The annotation marks 1998 at 0.61°C above the baseline. This scene shows that positive anomalies become more common.

Scene 3 is “The Warmest Years Are Recent.” It displays the complete dataset through 2025 and highlights the years beginning in 2015. The annotation identifies 2024 at 1.28°C above the baseline, the highest annual value in the local dataset. The viewer can hover over any point to inspect its exact year and value.

The scenes are ordered chronologically because the later values are more meaningful after the viewer has seen the earlier range.

## Annotations

Each scene contains one annotation created with the `d3-annotation` library. All annotations use the same callout-circle template. A connector points to the data value, and the note contains a short title and one sentence with the year and value.

The annotations are visible as soon as the scene appears. They do not depend on a mouseover. The annotation changes when the scene changes because each scene has a different piece of evidence to emphasize: 1909 for the early period, 1998 for the upward change, and 2024 for the recent record.

## Parameters

The main parameter is `currentScene`. Its value can be 0, 1, or 2. It determines which scene object is selected and therefore controls the title, description, ending year, highlighted period, annotation, buttons, and availability of tooltips.

The second parameter is `hoveredYear`. In the final scene it stores the year under the mouse, and it returns to `null` when the mouse leaves a point. `temperatureData` stores the parsed local CSV records after they load. Each scene filters this data using its `endYear` and `focusStart` values. These scene settings are stored in the `scenes` array and passed to the functions that construct the chart.

## Triggers

The Next button increases `currentScene`, and the Previous button decreases it. After either change, the trigger calls `drawScene()` to clear and rebuild the chart for the new state. Buttons are disabled when the viewer reaches the beginning or end of the slideshow.

In the final scene, mouseover events on the data points are additional triggers. A mouseover updates `hoveredYear` and displays a tooltip with the year and exact anomaly. Mouse movement changes the tooltip position, and mouseout resets `hoveredYear` and hides the tooltip. The instruction below the chart and the visible points communicate that this interaction is available.
