import { RootLayout } from '@payloadcms/next/layouts';
import configPromise from '@payload-config';
import { importMap } from './importMap';
import '@payloadcms/next/css';

type Args = {
  children: React.ReactNode;
};

export default function Layout({ children }: Args) {
  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={async function () {}}>
      {children}
    </RootLayout>
  );
}