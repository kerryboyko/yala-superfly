There are cases in the UI element where the code is using `<p>` tag elements,
and yet, I need to put `<div>` tag elements inside. This causes a hydration error,
so I create these custom components to slightly modify the original to fit my needs.

This is actually one of the benefits of using Shadcn - that you can easily copy and
modify those UI elements as need be.
