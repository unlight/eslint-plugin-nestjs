import { parseIntPipe } from './parse-int-pipe/parse-int-pipe';
import { deprecatedApiModules } from './deprecated-api-modules/deprecated-api-modules';
import { useDependencyInjection } from './use-dependency-injection/use-dependency-injection';

export const rules = {
    'parse-int-pipe': parseIntPipe,
    'deprecated-api-modules': deprecatedApiModules,
    'use-dependency-injection': useDependencyInjection,
};

export const configs = {
    recommended: {
        rules: {
            'parse-int-pipe': 1,
            'deprecated-api-modules': 1,
            'use-dependency-injection': 1,
        }
    }
};
