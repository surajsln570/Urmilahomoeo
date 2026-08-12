import { z } from "zod";

// From app/modules/dashboard/requests/StoreHeroImageRequest.php
// (image/file constraints are enforced separately via lib/upload.ts::validateImage
//  since Zod cannot validate a File's magic bytes on the server in the same call.)
export const heroImageMeta = z.object({
  status: z.coerce.boolean().optional(),
});
