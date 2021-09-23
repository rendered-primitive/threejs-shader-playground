// As long as you only need the visual effect of slicing through your geometry, use user clipping planes and a stencil algorithm to fill the opened hole.
// This is probably what you want for interactive mode before you calculate the new triangles to close the hole with a true clipper and tesselator.

// The simplest one which works for closed shapes only goes like this:
// Init the stencil buffer to 0.
// Enable clipping plane.
// Draw backfaces of the cut object. Pixels which pass the z test should set the stencil to 1.
// Draw the front faces of the cut object. Pixels which pass the depth test set the stencil to 0.
// For a highlight effect of the cut, draw a full window rectangle where all stencil values are 1. For a lit plane draw a big enough 3D quad with the clip plane orientation in the desired material where stencil values are 1.
// This should color all faces where you can see a back face, aka. the inside.
// To increase the fidelity at the edges, set glDepthFunc(GL_LEQUAL) instead of GL_LESS.
// In case your geometry has T-vertices you might get some stitch marks at such edges.

// [This message has been edited by Relic (edited 02-04-2003).]

export const stencil = 'stencil';