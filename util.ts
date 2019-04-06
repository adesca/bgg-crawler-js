import {XmlElement} from "xmldoc";

export function getAttributeFromChildWithName(attribute: string, childName: string, xmlElement: XmlElement): string {
    const potentialChild = xmlElement.childNamed(childName);
    if (potentialChild) {
        return potentialChild.attr[attribute];
    }

    throw new Error(`could not find child tag ${childName}`);
}

export function getValuesFromChildrenWithNameAndType(name: string, type: string, xmlElement: XmlElement): string[] {
    return xmlElement.childrenNamed(name)
        .filter(child => child.attr.type === type)
        .map(child => {
            return child.attr.value;
        });
}