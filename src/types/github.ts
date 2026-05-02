export interface FileNode {
  path: string;
  type: 'blob' | 'tree';
}

export interface SourceContext {
  path: string;
  content: string;
}

export interface RepoResponse {
  tree: FileNode[];
  fileContents: SourceContext[];
  branchName: string;
}

export interface RepositoryData {
  success: boolean;
  currentBranch: string;
  treeCount: number;
  fileContentCount: number;
  tree: FileNode[];
  sourceContext: SourceContext[];
}
