<script lang="ts">
	import type { Component } from 'svelte';

	import BookOpenText from '~icons/lucide/book-open-text';
	import Clock3 from '~icons/lucide/clock-3';
	import LayoutGrid from '~icons/lucide/layout-grid';
	import LayoutTemplate from '~icons/lucide/layout-template';
	import PenLine from '~icons/lucide/pen-line';
	import Layers3 from '~icons/lucide/layers-3';
	import Mail from '~icons/lucide/mail';
	import MousePointerClick from '~icons/lucide/mouse-pointer-click';
	import NotebookPen from '~icons/lucide/notebook-pen';
	import Palette from '~icons/lucide/palette';
	import Sparkles from '~icons/lucide/sparkles';
	import Type from '~icons/lucide/type';
	import ArrowRight from '~icons/lucide/arrow-right';
	import ArrowUpRight from '~icons/lucide/arrow-up-right';

	import { Button, Card, Chip, EditorialList, GhostInput, InsightBlock } from '$lib';

	type IconComponent = Component<{ class?: string }>;

	type Note = {
		id: string;
		category: string;
		description: string;
		icon: IconComponent;
		length: string;
		title: string;
	};

	type Principle = {
		id: string;
		icon: IconComponent;
		label: string;
		value: string;
	};

	const principles: Principle[] = [
		{
			id: 'tone',
			icon: Layers3,
			label: 'Tone',
			value: 'Surface shifts replace dividers, blur, and unnecessary lift.'
		},
		{
			id: 'type',
			icon: Type,
			label: 'Type',
			value: 'Large headlines carry the conviction before decoration can.'
		},
		{
			id: 'accent',
			icon: Palette,
			label: 'Accent',
			value: 'Gold appears only on commitment, focus, and key insight.'
		},
		{
			id: 'motion',
			icon: MousePointerClick,
			label: 'Motion',
			value: 'Interaction acknowledges intent without moving the whole page.'
		}
	];

	const notes: Note[] = [
		{
			id: 'narrative',
			category: 'Founder Notes',
			description:
				'Turn personal strategy notes into a reading experience that feels final instead of promotional.',
			icon: NotebookPen,
			length: '04 min',
			title: 'The interface should read like a conviction, not a campaign.'
		},
		{
			id: 'structure',
			category: 'System Design',
			description:
				'Cards, lists, and calls to action hold together because the surfaces step through density instead of reaching for borders.',
			icon: LayoutGrid,
			length: '06 min',
			title: 'Structure appears through tone before it appears through chrome.'
		},
		{
			id: 'accent',
			category: 'Interaction',
			description:
				'The amber accent is reserved for moments that need commitment: a primary action, a focus state, a key insight.',
			icon: MousePointerClick,
			length: '03 min',
			title: 'One sharp accent feels more premium than six polite ones.'
		}
	];

	let email = $state('');
</script>

<svelte:head>
	<title>Digital Curator Design System</title>
	<meta
		name="description"
		content="A minimal editorial design system in Svelte 5 with buttons, chips, cards, field notes, a ghost input, and an insight block."
	/>
</svelte:head>

<main class="px-5 pt-6 pb-24 sm:px-8 sm:pt-8 lg:px-12 lg:pb-32">
	<div class="mx-auto max-w-6xl space-y-20 sm:space-y-24 lg:space-y-28">
		<section
			aria-labelledby="hero-title"
			class="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-16"
		>
			<div class="space-y-8 lg:max-w-4xl">
				<Chip>
					{#snippet icon()}
						<LayoutTemplate class="size-3.5" />
					{/snippet}
					Design System
				</Chip>

				<div class="space-y-6">
					<p class="ds-eyebrow">
						<NotebookPen aria-hidden="true" class="ds-eyebrow__icon" />

						The Digital Curator
					</p>
					<h1
						class="max-w-[9ch] text-5xl font-semibold tracking-[-0.07em] text-(--color-ink) sm:text-7xl sm:leading-[0.92]"
						id="hero-title"
					>
						Clarity has to feel authored.
					</h1>
					<p
						class="max-w-2xl text-lg leading-8 text-(--color-muted) sm:text-[1.35rem] sm:leading-9"
					>
						A restrained system for founder-led pages: tonal surfaces, editorial type, one
						disciplined accent, and components that guide attention without trying to perform.
					</p>
				</div>

				<a class="ds-inline-link" href="#components">
					Review the core primitives
					<ArrowUpRight aria-hidden="true" class="ds-inline-link__icon" />
				</a>
			</div>

			<Card
				class="bg-(--surface-container-low) lg:mt-10"
				eyebrow="System Notes"
				title="Minimalism only works when hierarchy stays legible."
			>
				{#snippet eyebrowIcon()}
					<Layers3 class="size-4" />
				{/snippet}

				<p>
					The revision removes decorative lift and lets structure come from spacing, type scale, and
					a narrow set of tonal steps.
				</p>

				<dl class="grid gap-5 pt-2">
					{#each principles as principle (principle.id)}
						{@const PrincipleIcon = principle.icon}

						<div class="grid gap-1">
							<dt class="ds-eyebrow">
								<span aria-hidden="true" class="ds-eyebrow__icon">
									<PrincipleIcon class="size-4" />
								</span>

								{principle.label}
							</dt>
							<dd class="max-w-[26ch] text-sm leading-6 text-(--color-ink)">
								{principle.value}
							</dd>
						</div>
					{/each}
				</dl>
			</Card>
		</section>

		<InsightBlock
			attribution="Core principle"
			eyebrow="Insight Block"
			quote="Minimalism fails the moment every component asks for attention at once."
		>
			{#snippet eyebrowIcon()}
				<Sparkles class="size-4" />
			{/snippet}

			<p>
				The page now spends emphasis in only three places: the hero headline, the core insight, and
				the primary action. Everything else supports those moments through quieter surfaces and
				tighter rhythm.
			</p>
		</InsightBlock>

		<section aria-labelledby="components-title" class="space-y-6" id="components">
			<div class="max-w-2xl space-y-3">
				<p class="ds-eyebrow">
					<LayoutGrid aria-hidden="true" class="ds-eyebrow__icon" />

					Core Primitives
				</p>
				<h2
					class="text-4xl font-semibold tracking-[-0.05em] text-(--color-ink) sm:text-5xl"
					id="components-title"
				>
					A small component set, used with restraint.
				</h2>
				<p class="max-w-xl text-base leading-7 text-(--color-muted) sm:text-lg">
					Buttons, chips, and cards stay intentionally plain so the page can feel composed rather
					than assembled.
				</p>
			</div>

			<div class="grid gap-6 lg:grid-cols-12">
				<Card
					class="lg:col-span-7"
					eyebrow="Buttons and Chips"
					title="Actions stay firm. Metadata stays quiet."
				>
					{#snippet eyebrowIcon()}
						<MousePointerClick class="size-4" />
					{/snippet}

					<p>
						Primary actions use a solid tone. Secondary actions stay in the paper stack. Tertiary
						actions read like edited text, not miniature banners.
					</p>

					<div class="flex flex-wrap gap-2 pt-2">
						<Chip>
							{#snippet icon()}
								<NotebookPen class="size-3.5" />
							{/snippet}
							Field Note
						</Chip>
						<Chip>
							{#snippet icon()}
								<Layers3 class="size-3.5" />
							{/snippet}
							Advisory
						</Chip>
						<Chip>
							{#snippet icon()}
								<PenLine class="size-3.5" />
							{/snippet}
							Writing
						</Chip>
					</div>

					<div class="flex flex-wrap gap-3 pt-4">
						<Button iconPlacement="end" variant="primary">
							{#snippet icon()}
								<ArrowUpRight class="size-4" />
							{/snippet}
							Book a strategy session
						</Button>

						<Button iconPlacement="start" variant="secondary">
							{#snippet icon()}
								<BookOpenText class="size-4" />
							{/snippet}
							Browse field notes
						</Button>

						<Button iconPlacement="end" variant="tertiary">
							{#snippet icon()}
								<ArrowRight class="size-4" />
							{/snippet}
							Read the rationale
						</Button>
					</div>
				</Card>

				<Card
					class="bg-(--surface-container-low) lg:col-span-5 lg:mt-10"
					eyebrow="Cards"
					href="#contact"
					title="Cards should read like stacked paper, not floating widgets."
				>
					{#snippet eyebrowIcon()}
						<Layers3 class="size-4" />
					{/snippet}

					<p>
						Interactivity comes from slightly denser tone and clearer focus, not from gradients,
						oversized shadows, or exaggerated lift.
					</p>

					{#snippet footer()}
						<span>Jump to the form pattern</span>
						<ArrowUpRight aria-hidden="true" class="size-4 shrink-0" />
					{/snippet}
				</Card>
			</div>
		</section>

		<EditorialList
			intro="Each note gets its own quiet surface and enough room to read like a short editorial fragment, not a dashboard row."
			items={notes}
			title="Field notes"
		>
			{#snippet row(note)}
				{@const NoteIcon = note.icon}

				<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8">
					<div class="max-w-2xl space-y-4">
						<Chip>
							{#snippet icon()}
								<NoteIcon class="size-3.5" />
							{/snippet}
							{note.category}
						</Chip>
						<div class="space-y-3">
							<h3
								class="max-w-[24ch] text-2xl font-semibold tracking-[-0.05em] text-(--color-ink) sm:text-3xl"
							>
								{note.title}
							</h3>
							<p class="max-w-[58ch] text-base leading-7 text-(--color-muted)">
								{note.description}
							</p>
						</div>
					</div>

					<p class="ds-eyebrow">
						<Clock3 aria-hidden="true" class="ds-eyebrow__icon" />

						{note.length}
					</p>
				</div>
			{/snippet}
		</EditorialList>

		<section
			aria-labelledby="contact-title"
			class="grid gap-8 rounded-4xl bg-(--surface-container-low) px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-12"
			id="contact"
		>
			<div class="space-y-4">
				<p class="ds-eyebrow">
					<Mail aria-hidden="true" class="ds-eyebrow__icon" />

					Input Field
				</p>
				<h2
					class="max-w-[11ch] text-4xl font-semibold tracking-[-0.05em] text-(--color-ink) sm:text-5xl"
					id="contact-title"
				>
					Ghost borders, decisive focus.
				</h2>
				<p class="max-w-xl text-base leading-7 text-(--color-muted)">
					The input stays almost invisible until the user engages with it. Then the accent line
					arrives from the center, making focus obvious without resorting to chrome.
				</p>
			</div>

			<Card title="Request a working session">
				<form class="space-y-6">
					<GhostInput
						autocomplete="email"
						bind:value={email}
						hint="Monthly product notes and occasional writing on positioning, systems, and product craft."
						label="Email address"
						name="email"
						placeholder="founder@company.com"
						type="email"
					/>

					<Button iconPlacement="end" type="submit" variant="primary" wide={true}>
						{#snippet icon()}
							<ArrowRight class="size-4" />
						{/snippet}
						Join the note
					</Button>
				</form>
			</Card>
		</section>
	</div>
</main>
