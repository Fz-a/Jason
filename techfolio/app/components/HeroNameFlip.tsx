"use client";

export function HeroNameFlip() {
	return (
		<span
			className="hero-name-roll"
			tabIndex={0}
			aria-label="Jason, hover to reveal 陈进阳"
		>
			<span className="hero-name-roll__shell">
				<span className="hero-name-roll__sizer" aria-hidden="true">
					<span className="hero-name-roll__sizer-en">Jason</span>
					<span className="hero-name-roll__sizer-zh">陈进阳</span>
				</span>
				<span className="hero-name-roll__viewport">
					<span className="hero-name-roll__track">
						<span className="hero-name-roll__line hero-name-roll__line--en">
							<span className="hero-name-roll__text">Jason</span>
						</span>
						<span className="hero-name-roll__line hero-name-roll__line--zh" aria-hidden="true">
							<span className="hero-name-roll__text hero-name-roll__text--zh">陈进阳</span>
						</span>
					</span>
				</span>
				<span className="hero-name-roll__glow" aria-hidden="true" />
			</span>
		</span>
	);
}
