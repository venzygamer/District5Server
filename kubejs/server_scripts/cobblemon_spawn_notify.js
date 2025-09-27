// Cobblemon spawn announcements with dimension filtering
// Only shiny, legendary, mythical Pokémon

const SpawnEvent = Java.loadClass("com.cobblemon.mod.common.api.events.entity.SpawnEvent");

const BLOCKED_DIMS = ["district5:normalworld"];

ForgeEvents.onEvent(SpawnEvent, event => {
    if (event.getWorld().isClientSide()) return;

    const dim = event.getWorld().dimension().location().toString();
    if (BLOCKED_DIMS.includes(dim)) return;

    const entity = event.getEntity();
    if (!entity) return;

    const pokemon = entity.getPokemon();
    if (!pokemon) return;

    const isShiny = pokemon.getShiny();
    const isLegendary = pokemon.getSpecies().isLegendary();
    const isMythical = pokemon.getSpecies().isMythical();

    if (!(isShiny || isLegendary || isMythical)) return;

    const pos = entity.blockPosition();
    const speciesName = pokemon.getSpecies().getTranslatedName().getString();

    let typeLabel = "";
    if (isShiny) typeLabel = "✨ Shiny ";
    else if (isLegendary) typeLabel = "★ Legendary ";
    else if (isMythical) typeLabel = "★ Mythical ";

    const msg = Text.of(`${typeLabel}${speciesName} appeared at ${pos.getX()}, ${pos.getY()}, ${pos.getZ()} in ${dim}`);

    event.getWorld().players().forEach(p => {
        if (p.level().dimension().location().toString() === dim) {
            p.sendSystemMessage(msg);
        }
    });
});

