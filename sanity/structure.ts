import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('S&R Dashmin')
    .items([
      S.documentTypeListItem('product'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => ![ 'product'].includes(listItem.getId()!),
      ),
    ]);
