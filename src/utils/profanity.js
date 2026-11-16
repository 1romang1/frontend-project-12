import profanity from 'leo-profanity';

// The library defaults to English. Enable both English and Russian dictionaries
// because Hexlet Chat is Russian-language but messages can contain either language.
profanity.clearList();
profanity.add(profanity.getDictionary('en'));
profanity.add(profanity.getDictionary('ru'));

export function censorProfanity(text) {
  return profanity.clean(text);
}
