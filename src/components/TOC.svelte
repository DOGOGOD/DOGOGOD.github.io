<script>
	import { onMount } from 'svelte'
	import { siteConfig } from '@/config'
	import i18nit from '@i18n/translation'

	let { headings = [], language } = $props()
	const t = $derived(i18nit(language))

	let activeSlug = $state('')
	let desktopTocListElement = $state(null)
	let mobileTocListElement = $state(null)
	let mobileTocElement = $state(null)
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
	const activeHeadingText = $derived(
		filteredHeadings.find((heading) => heading.slug === activeSlug)?.text
			|| filteredHeadings[0]?.text
			|| ''
	)

	function closeMobileToc() {
		if (mobileTocElement) mobileTocElement.open = false
	}

	onMount(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		let syncFrame = 0
		const isKnownHeading = (slug) => filteredHeadings.some((heading) => heading.slug === slug)
		const nearestHeadingSlug = () => filteredHeadings
			.map((heading) => document.getElementById(heading.slug))
			.filter(Boolean)
			.filter((element) => element.getBoundingClientRect().top <= 140)
			.at(-1)?.id || filteredHeadings[0]?.slug || ''
		const resolvedHeadingSlug = (candidate) => (
			isKnownHeading(candidate) ? candidate : nearestHeadingSlug()
		)

		const syncTocPosition = (slug, behavior = 'smooth') => {
			const activeIndex = filteredHeadings.findIndex((heading) => heading.slug === slug)
			if (activeIndex < 0) return

			;[desktopTocListElement, mobileTocListElement].filter(Boolean).forEach((listElement) => {
				if (listElement.clientHeight === 0) return
				const activeLink = listElement.querySelectorAll('a')[activeIndex]
				if (!activeLink) return

				const listRect = listElement.getBoundingClientRect()
				const linkRect = activeLink.getBoundingClientRect()
				const targetTop = listElement.scrollTop
					+ linkRect.top
					- listRect.top
					- listElement.clientHeight / 2
					+ activeLink.clientHeight / 2

				listElement.scrollTo({
					top: Math.max(0, targetTop),
					behavior: prefersReducedMotion ? 'auto' : behavior
				})
			})
		}

		const setActiveHeading = (slug, behavior = 'smooth') => {
			if (!slug) return
			activeSlug = slug
			cancelAnimationFrame(syncFrame)
			syncFrame = requestAnimationFrame(() => syncTocPosition(slug, behavior))
		}

		const handleMobileToggle = () => {
			if (!mobileTocElement?.open || !activeSlug) return
			cancelAnimationFrame(syncFrame)
			syncFrame = requestAnimationFrame(() => syncTocPosition(activeSlug, 'auto'))
		}
		mobileTocElement?.addEventListener('toggle', handleMobileToggle)

		let hashSlug = ''
		try {
			hashSlug = decodeURIComponent(window.location.hash.slice(1))
		} catch {
			hashSlug = ''
		}
		const initialSlug = resolvedHeadingSlug(hashSlug)
		setActiveHeading(initialSlug, 'auto')

		const handleHashChange = () => {
			try {
				setActiveHeading(
					resolvedHeadingSlug(decodeURIComponent(window.location.hash.slice(1))),
					'auto'
				)
			} catch {}
		}
		window.addEventListener('hashchange', handleHashChange)

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
			mobileTocElement?.removeEventListener('toggle', handleMobileToggle)
			window.removeEventListener('hashchange', handleHashChange)
		}
	})
</script>

<div class="article-toc">
	<details class="toc-mobile" bind:this={mobileTocElement}>
		<summary>
			<span class="toc-mobile-label">{t('toc')}</span>
			<span class="toc-mobile-current">{activeHeadingText}</span>
		</summary>
		<nav aria-label={t('toc')}>
			<ul class="toc-list toc-mobile-list" bind:this={mobileTocListElement}>
				{#each filteredHeadings as heading}
					<li>
						<a
							href={`#${heading.slug}`}
							class:active={activeSlug === heading.slug}
							aria-current={activeSlug === heading.slug ? 'location' : undefined}
							style:padding-left={`${0.95 + (heading.depth - minDepth) * 0.8}rem`}
							onclick={closeMobileToc}
						>
							{heading.text}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</details>

	<aside class="toc-desktop" aria-labelledby="toc-heading">
		<h2 id="toc-heading">{t('toc')}</h2>
		<nav aria-label={t('toc')}>
			<ul class="toc-list" bind:this={desktopTocListElement}>
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

</div>

<style>
	.article-toc {
		color: var(--text-color);
	}

	.toc-mobile {
		display: block;
		overflow: hidden;
		border: 1px solid var(--border-color);
		border-radius: 12px;
		background: var(--bg-color);
	}

	.toc-mobile summary {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) 0.65rem;
		align-items: center;
		gap: 0.75rem;
		min-height: 3.25rem;
		padding: 0.75rem 1rem;
		cursor: pointer;
		list-style: none;
		transition: background-color 180ms ease;
	}

	.toc-mobile summary::-webkit-details-marker {
		display: none;
	}

	.toc-mobile summary::after {
		width: 0.45rem;
		height: 0.45rem;
		border-right: 1.5px solid currentColor;
		border-bottom: 1.5px solid currentColor;
		content: '';
		transform: translateY(-0.12rem) rotate(45deg);
		transition: transform 180ms ease;
	}

	.toc-mobile[open] summary::after {
		transform: translateY(0.12rem) rotate(225deg);
	}

	.toc-mobile summary:hover {
		background: var(--button-hover-color);
	}

	.toc-mobile summary:focus-visible {
		outline: 2px solid var(--link-color);
		outline-offset: -3px;
	}

	.toc-mobile-label {
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0.06em;
	}

	.toc-mobile-current {
		overflow: hidden;
		color: var(--text-color-70);
		font-size: 0.85rem;
		text-align: right;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.toc-mobile nav {
		border-top: 1px solid var(--border-color);
	}

	.toc-mobile .toc-list {
		max-height: min(52dvh, 24rem);
		padding: 0.5rem;
		border-left: 0;
	}

	.toc-mobile .toc-list a {
		padding-block: 0.6rem;
		border-radius: 8px;
	}

	.toc-mobile .toc-list a::before {
		display: none;
	}

	.toc-mobile .toc-list a.active {
		background: var(--button-hover-color);
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

	.toc-list a:focus-visible {
		outline: 2px solid var(--link-color);
		outline-offset: 0.2rem;
	}

	@media (min-width: 1180px) {
		.toc-mobile {
			display: none;
		}

		.toc-desktop {
			display: block;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.toc-list a,
		.toc-mobile summary,
		.toc-mobile summary::after {
			transition: none;
		}
	}
</style>
