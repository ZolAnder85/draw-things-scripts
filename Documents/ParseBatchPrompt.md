# Parse Batch Prompt

Look for cheat sheet further below.

This script divides the positive prompt into blocks separated by at least two line-breaks.
These blocks are preprocessed for unrolling wildcards and other preprocessor commands.
The resulted blocks are executed in sequence, most of them correcponding to one generation.
They can contain commands for customizing configuration or execute other functions.

## Preprocessor Examples

```
{kitten|cat} and {puppy+dog} friends
// selects kitten or cat randomly once and executes two generations
// selected-animal and puppy friends
// selected-animal and dog friends

{kitten+cat} and {puppy|dog} friends
// executes two generations randomly selecting dog or puppy for each
// kitten and dog-or-puppy friends
// cat and dog-or-puppy friends

// {@canine={puppy|dog}}
// selects puppy or dog randomly and assignes it to canine
{kitten+cat} and {@canine} friends
// executes two generations with the assigned value used
// kitten and canine-value friends
// cat and canine-value friends

// {@canine=puppy|dog}
// assignes the literal string to canine
{kitten+cat} and {{@canine}} friends
// executes two generations randomly selecting dog or puppy for each
// kitten and dog-or-puppy friends
// cat and dog-or-puppy friends

{kitten+cat} and {puppy+dog} friends
// generates all four possibilities

/guidanceScale: {5:8:0.5}
cat and dog friends
// preprocessor works with commands too
// generates with guidances 5, 5.5, 6, 6.5, 7, 7.5, 8
```

## Command Examples

```
cat and dog
- deformed
// generates cat and dog with negative deformed

/model: DreamShaper
// sets model to DreamShaper
// does not generate because no prompt was given

/generate
// generate is called directly
// falls back to previous prompts because no prompts were given

/model: RealisticVision
/empty
// sets model to RealisticVision
// runs generation because prompt was given with empty

- deformed
/generate
// new negative prompt is used
// positive prompt falls back to previous

/size: 1152 768
/generate: cat-and-dog.png
// generates and saves image
```

## Advanced Examples

```
// {@index={10}}
/model: {@model={LOLModel+SADModel}}
/sampler: {@sampler={LCM|TCD}}
black hat
- cap
/generate: black-hat-{@index}-{@model}-{@sampler}.png
// generates with various models and samplers and saves with their names

cat
/generate: initial.png

{@animal={dog+horse+elephant}}
/load: initial.png
/strength: {0.1:0.9:0.1}
/generate: {@animal}-{@i}.png
/load: {@animal}-{@i}.png custom
// loads cat image and transforms it into other animals with strength-walking
// loads each intermediate image into the custom layer
// does this for all given animal
```