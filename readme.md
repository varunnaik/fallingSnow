Falling Snow
---
Add snowfall to any page
Demo: http://varunnaik.github.io/fallingSnow/

No external dependencies. Just include the scipt file, configure it as below (or use the page above to generate the config for you) and you're ready to go.

Options:
------

```
var snow = fallingSnow();
snow.fall(
    speed: 0.5, // 0.3-1.0, 1.0 = faster
    intensity: 10, // 10-100, 100 = blizzard
    snowflakeSize: 3, // 1-5, 5 = huge flakes
    element: 'html' // QuerySelector used to add flakes to an element        
);
```


