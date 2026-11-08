import { FilePath, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import sharp from "sharp"
import { glob } from "../../util/glob"
import { dirname } from "path"

export const Static: QuartzEmitterPlugin = () => ({
  name: "Static",
  async *emit({ argv, cfg }) {
    const staticPath = joinSegments(QUARTZ, "static")
    const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns)
    const outputStaticPath = joinSegments(argv.output, "static")
    await fs.promises.mkdir(outputStaticPath, { recursive: true })
    for (const fp of fps) {
      const src = joinSegments(staticPath, fp) as FilePath
      const dest = joinSegments(outputStaticPath, fp) as FilePath
      await fs.promises.mkdir(dirname(dest), { recursive: true })
      await fs.promises.copyFile(src, dest)
      yield dest

      // Keep the original, but deliver a high-detail WebP on the About page.
      // Preserve enough pixels for retina displays without shipping the full JPG.
      // A new filename also avoids browsers caching the lower-quality WebP.
      if (fp === "bottom.jpg") {
        const optimized = joinSegments(outputStaticPath, "bottom-hq.webp") as FilePath
        await sharp(src)
          .rotate()
          .resize({ width: 1800, withoutEnlargement: true })
          .webp({ quality: 90, effort: 6 })
          .toFile(optimized)
        yield optimized
      }
    }
  },
  async *partialEmit() {},
})
