import noopService from 'astro/assets/services/noop';

// Development previews need original image URLs, not the Sharp endpoint.
// Vite serves imported files (including Chinese filenames) with the right MIME
// type and filesystem access checks. Production keeps the default image service.
export default {
  ...noopService,
  getURL(options) {
    return typeof options.src === 'string' ? options.src : options.src.src;
  },
};
