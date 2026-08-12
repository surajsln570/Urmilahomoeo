import { getAllHeroImages } from "@/actions/hero-image.actions";
import { HeroImagesManager } from "@/components/dashboard/hero-images-manager";

// Converted from HeroController::show()
export default async function HeroImagesPage() {
  const images = await getAllHeroImages();
  return <HeroImagesManager initialImages={images} />;
}
