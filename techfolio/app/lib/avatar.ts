import homeAvatar from "../../content/avatar.json";
import introduceAvatar from "../../content/avatar-introduce.json";

export type AvatarVariant = "home" | "introduce";

export type AvatarSettings = {
	src: string;
	source?: string;
	scale: number;
	tx: number;
	ty: number;
	v?: number;
};

export const AVATAR_VARIANTS: AvatarVariant[] = ["home", "introduce"];

export const AVATAR_CONFIG: Record<AvatarVariant, AvatarSettings> = {
	home: homeAvatar,
	introduce: introduceAvatar,
};

/** Cache-busted display src for a variant. */
export function avatarDisplaySrc(variant: AvatarVariant): string {
	const c = AVATAR_CONFIG[variant];
	return c.v ? `${c.src}?v=${c.v}` : c.src;
}
