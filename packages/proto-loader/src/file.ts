import * as Protobuf from 'protobufjs';
import * as grpc from './util';

function isNamespaceBase(
  obj: Protobuf.ReflectionObject
) : obj is Protobuf.NamespaceBase {
  return Array.isArray((obj as Protobuf.NamespaceBase).nestedArray);
}

function getAllFiles(namespace: Protobuf.NamespaceBase): string[] {
  let result: string[] = [];
  for (const nested of namespace.nestedArray) {
    if (nested.filename) {
      result.push(nested.filename);
    }
    if (isNamespaceBase(nested)) {
      result.push(...getAllFiles(nested));
    }
  }
  return result;
}

grpc.addCommonProtos();

export function getAllProtoFiles(
  filename: string | string[],
  options?: grpc.Options
): string[] {
  const root = grpc.loadProtosWithOptionsSync(filename, options);
  const files = getAllFiles(root);

  return [...new Set(files)];
}