import React from "react";
import type { ReactNode, ComponentType } from "react";

type ProviderComponent = React.FC<{ children: ReactNode }> | ComponentType<{ children: ReactNode }>;

function CombineProviders(...providers: ProviderComponent[]) {
    return ({ children }: {children: ReactNode}) => 
    providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>;
    }, children);
}

export default CombineProviders;