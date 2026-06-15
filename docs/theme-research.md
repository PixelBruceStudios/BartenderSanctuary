# Theme Research & Plan

## Current state
- Global theme lives in `styles/globals.css` using CSS custom properties.
- Space UI is split across `components/HeroNebula.tsx` and `components/SpaceUniverse.tsx`.
- Lesson renderer is in `components/LessonPage.tsx` and uses a starfield.

## Requested direction
- Palette: sage green + gold.
- Theme concept: chemistry / bottles, not space.
- Scope: whole app + lesson renderer.

## Feasible approach without a full redesign
1. Replace the space-specific CSS variables and animations with chemistry-inspired equivalents while keeping the existing glassmorphism structure.
2. Reskin the space backgrounds:
   - `HeroNebula` → soft fluid/copper-green gradients with a laboratory vignette.
   - `SpaceUniverse` → bubble/flask-like nodes instead of starfield/planet orbits.
3. Update `LessonPage` to use a chemistry-themed container/background instead of the starfield canvas.
4. Keep the color changes to `globals.css` and the selected components to avoid breaking the rest of the app.

## First safe step
- Change the palette in `globals.css` from indigo/space to sage/gold.
- Then update the space components to match.
- Then update the lesson renderer background.
