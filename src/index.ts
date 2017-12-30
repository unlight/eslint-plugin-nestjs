import { parseIntPipe } from './parse-int-pipe/parse-int-pipe';
import { deprecatedApiModules } from './deprecated-api-modules/deprecated-api-modules';

export const rules = {
    'parse-int-pipe': parseIntPipe,
    'deprecated-api-modules': deprecatedApiModules,
};

export const configs = {
    recommended: {
        rules: {
            'parse-int-pipe': 1,
            'deprecated-api-modules': 1,
        }
    }
};
