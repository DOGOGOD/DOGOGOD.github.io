<script>
	import { onMount } from 'svelte'
	import { siteConfig } from '@/config'
	import i18nit from '@i18n/translation'

	let { headings = [], language } = $props()
	const t = $derived(i18nit(language))

	let activeSlug = $state('')
	let tocListElement = $state(null)
	const minDepth = $derived(headings.length > 0 ? Math.min(...headings.map((heading) => heading.depth)) : 0)
	const maxDepth = $derived(minDepth + (siteConfig?.toc?.depth || 2))
	const filteredHeadings = $derived(
		headings.filter((heading) => {
			const headingText = heading.text.trim()
			const headingSlug = heading.slug.toLowerCase()
			const isContentsHeading = /^(目录|contents|table of contents)$/i.test(headingText)
				|| ['目录', 'contents', 'table-of-contents'].includes(headingSlug)
			return heading.depth < maxDepth && !isContentsHeading
		})
	)

	onMount(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		let syncFrame = 0

		const syncTocPosition = (slug, behavior = 'smooth') => {
			if (!tocListElement) return

			const activeIndex = filteredHeadings.findIndex((heading) => heading.slug === slug)
			const activeLink = tocListElement.querySelectorAll('a')[activeIndex]
			if (!activeLink) return

			const targetTop = activeLink.offsetTop
				- tocListElement.clientHeight / 2
				+ activeLink.clientHeight / 2

			tocListElement.scrollTo({
				top: Math.max(0, targetTop),
				behavior: prefersReducedMotion ? 'auto' : behavior
			})
		}

		const setActiveHeading = (slug, behavior = 'smooth') => {
			if (!slug) return
			activeSlug = slug
			cancelAnimationFrame(syncFrame)
			syncFrame = requestAnimationFrame(() => syncTocPosition(slug, behavior))
		}

		const initialSlug = decodeURIComponent(window.location.hash.slice(1)) || filteredHeadings[0]?.slug || ''
		setActiveHeading(initialSlug, 'auto')

		const observer = new IntersectionObserver(
			(entries) => {
				const visibleEntry = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]

				if (visibleEntry) setActiveHeading(visibleEntry.target.id)
			},
			{ rootMargin: '-12% 0px -68% 0px', threshold: [0, 1] }
		)

		filteredHeadings.forEach((heading) => {
			const element = document.getElementById(heading.slug)
			if (element) observer.observe(element)
		})

		return () => {
			cancelAnimationFrame(syncFrame)
			observer.disconnect()
		}
	})
</script>

<div class="article-toc">
	<aside class="toc-desktop" aria-labelledby="toc-heading">
		<h2 id="toc-heading">{t('toc')}</h2>
		<nav aria-label={t('toc')}>
			<ul class="toc-list" bind:this={tocListElement}>
				{#each filteredHeadings as heading}
					<li>
						<a
							href={`#${heading.slug}`}
							class:active={activeSlug === heading.slug}
							aria-current={activeSlug === heading.slug ? 'location' : undefined}
							style:padding-left={`${0.95 + (heading.depth - minDepth) * 0.8}rem`}
						>
							{heading.text}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>

	<details class="toc-mobile">
		<summary>{t('toc')}</summary>
		<nav aria-label={t('toc')}>
			<ul>
				{#each filteredHeadings as heading}
					<li>
						<a
							href={`#${heading.slug}`}
							class:active={activeSlug === heading.slug}
							aria-current={activeSlug === heading.slug ? 'location' : undefined}
							style:padding-left={`${(heading.depth - minDepth) * 0.8}rem`}
						>
							{heading.text}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</details>
</div>

<style>
	.article-toc {
		color: var(--text-color);
	}

	.toc-desktop {
		position: fixed;
		top: 6.5rem;
		left: var(--toc-offset-left);
		z-index: 10;
		display: none;
		width: min(var(--toc-width), 15rem);
		max-height: calc(100dvh - 9rem);
	}

	.toc-desktop h2 {
		margin: 0 0 1.25rem;
		font-size: 1.1rem;
		font-weight: 600;
		letter-spacing: 0.08em;
	}

	.toc-list {
		max-height: calc(100dvh - 13rem);
		margin: 0;
		padding: 0.15rem 0;
		overflow-y: auto;
		border-left: 1px solid var(--border-color);
		list-style: none;
		scrollbar-width: none;
	}

	.toc-list::-webkit-scrollbar {
		display: none;
	}

	.toc-list li {
		margin: 0;
	}

	.toc-list a {
		position: relative;
		display: block;
		padding-block: 0.5rem;
		color: var(--text-color-70);
		font-size: 0.9rem;
		line-height: 1.45;
		text-decoration: none;
		transition: color 180ms ease, opacity 180ms ease;
	}

	.toc-list a::before {
		position: absolute;
		top: 0.45rem;
		bottom: 0.45rem;
		left: -1px;
		width: 2px;
		background: transparent;
		content: '';
	}

	.toc-list a:hover,
	.toc-list a.active {
		color: var(--link-color);
	}

	.toc-list a.active::before {
		background: var(--link-color);
	}

	.toc-list a:focus-visible,
	.toc-mobile a:focus-visible,
	.toc-mobile summary:focus-visible {
		outline: 2px solid var(--link-color);
		outline-offset: 0.2rem;
	}

	.toc-mobile {
		border-top: 1px solid var(--border-color);
		border-bottom: 1px solid var(--border-color);
	}

	.toc-mobile summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.9rem 0;
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		cursor: pointer;
		list-style: none;
	}

	.toc-mobile summary::-webkit-details-marker {
		display: none;
	}

	.toc-mobile summary::after {
		color: var(--link-color);
		font-size: 1.15rem;
		font-weight: 400;
		content: '+';
	}

	.toc-mobile[open] summary::after {
		content: '-';
	}

	.toc-mobile ul {
		display: grid;
		gap: 0.2rem;
		margin: 0;
		padding: 0 0 1rem;
		list-style: none;
	}

	.toc-mobile a {
		display: block;
		padding-block: 0.45rem;
		color: var(--text-color-70);
		font-size: 0.92rem;
		line-height: 1.5;
		text-decoration: none;
	}

	.toc-mobile a:hover,
	.toc-mobile a.active {
		color: var(--link-color);
	}

	@media (min-width: 1180px) {
		.toc-desktop {
			display: block;
		}

		.toc-mobile {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.toc-list a {
			transition: none;
		}
	}
</style>
